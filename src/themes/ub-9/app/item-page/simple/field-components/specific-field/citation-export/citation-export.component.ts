import { Clipboard } from '@angular/cdk/clipboard';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SecurityContext,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { Item } from '../../../../../../../../app/core/shared/item.model';
import { CitationGenerator } from './citation-generator';

/** Generates citations from descriptive metadata, without requiring a manually entered citation. */
@Component({
  selector: 'ds-citation-export',
  templateUrl: './citation-export.component.html',
  styleUrls: ['./citation-export.component.scss'],
  imports: [
    FormsModule,
    TranslateModule,
  ],
})
export class CitationExportComponent implements OnChanges {
  @Input() item: Item;

  selectedFormat = 'iso690';
  copyStatus: 'idle' | 'success' | 'error' = 'idle';

  readonly citationFormats = [
    { value: 'iso690', label: 'ISO 690' },
    { value: 'apa', label: 'APA' },
    { value: 'mla', label: 'MLA' },
    { value: 'chicago', label: 'Chicago/Turabian' },
    { value: 'vancouver', label: 'Vancouver' },
    { value: 'ieee', label: 'IEEE' },
    { value: 'bibtex', label: 'BibTeX' },
    { value: 'ris', label: 'RIS' },
  ];

  constructor(
    private clipboard: Clipboard,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  get isPlainTextFormat(): boolean {
    return this.selectedFormat === 'bibtex' || this.selectedFormat === 'ris';
  }

  ngOnChanges(): void {
    this.copyStatus = 'idle';
  }

  onFormatChange(): void {
    this.copyStatus = 'idle';
  }

  getCitationPreview(): string {
    const locale = (this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'ca').slice(0, 2);
    return new CitationGenerator(this.item, locale).generate(this.selectedFormat);
  }

  async copyToClipboard(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.item) {
      return;
    }

    const plainText = this.getPlainText();
    try {
      if (!this.isPlainTextFormat && navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        const html = this.sanitizer.sanitize(SecurityContext.HTML, this.getCitationPreview()) || '';
        await navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        })]);
        this.copyStatus = 'success';
        return;
      }
    } catch {
      // Browsers can reject rich-text clipboard access; retain the CDK plain-text fallback.
    }
    this.copyStatus = this.clipboard.copy(plainText) ? 'success' : 'error';
  }

  downloadCitation(): void {
    if (!isPlatformBrowser(this.platformId) || !this.item) {
      return;
    }

    const title = this.item.firstMetadataValue('dc.title') || 'citation';
    const filename = title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
    const extension = this.selectedFormat === 'bibtex' ? 'bib' : this.selectedFormat === 'ris' ? 'ris' : 'txt';
    const url = URL.createObjectURL(new Blob([this.getPlainText()], { type: 'text/plain;charset=utf-8' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = `${filename}_${this.selectedFormat}.${extension}`;
    this.document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
      URL.revokeObjectURL(url);
    }
  }

  private getPlainText(): string {
    const citation = this.getCitationPreview();
    if (this.isPlainTextFormat) {
      return citation;
    }
    const element = this.document.createElement('div');
    element.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, citation) || '';
    return element.textContent || '';
  }
}
