import { Clipboard } from '@angular/cdk/clipboard';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../../../../../../app/core/shared/item.model';
import { CitationExportComponent } from './citation-export.component';

describe('UB CitationExportComponent', () => {
  let fixture: ComponentFixture<CitationExportComponent>;
  let component: CitationExportComponent;
  let clipboard: jasmine.SpyObj<Clipboard>;

  beforeEach(async () => {
    clipboard = jasmine.createSpyObj<Clipboard>('Clipboard', ['copy']);
    clipboard.copy.and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [CitationExportComponent, TranslateModule.forRoot()],
      providers: [{ provide: Clipboard, useValue: clipboard }],
    }).compileComponents();
    fixture = TestBed.createComponent(CitationExportComponent);
    component = fixture.componentInstance;
    component.item = Object.assign(new Item(), {
      metadata: {
        'dc.title': [{ value: 'Estudi dels ecosistemes' }],
        'dc.contributor.author': [{ value: 'Garcia, Anna' }],
        'dc.date.issued': [{ value: '2024-05-12' }],
      },
    });
    component.selectedFormat = 'apa';
    fixture.detectChanges();
  });

  it('renders an automatically generated citation and all eight format choices', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.citation-preview').textContent).toContain('Garcia, A. (2024). Estudi dels ecosistemes.');
    expect(element.querySelectorAll('option').length).toBe(8);
  });

  it('copies machine-readable RIS as plain text and reports success', async () => {
    component.selectedFormat = 'ris';
    await component.copyToClipboard();
    expect(clipboard.copy.calls.mostRecent().args[0]).toContain('TI  - Estudi dels ecosistemes\n');
    expect(component.copyStatus).toBe('success');
    clipboard.copy.and.returnValue(false);
    await component.copyToClipboard();
    expect(component.copyStatus).toBe('error');
  });

  it('downloads a generated BibTeX file with the expected extension and content', async () => {
    component.selectedFormat = 'bibtex';
    const createUrl = spyOn(URL, 'createObjectURL').and.returnValue('blob:ub-citation-test');
    const revokeUrl = spyOn(URL, 'revokeObjectURL');
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    component.downloadCitation();
    const anchor = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(anchor.download).toBe('Estudi_dels_ecosistemes_bibtex.bib');
    expect(revokeUrl).toHaveBeenCalledWith('blob:ub-citation-test');
    const blob = createUrl.calls.mostRecent().args[0] as Blob;
    expect(await blob.text()).toContain('  title={Estudi dels ecosistemes},\n');
  });
});
