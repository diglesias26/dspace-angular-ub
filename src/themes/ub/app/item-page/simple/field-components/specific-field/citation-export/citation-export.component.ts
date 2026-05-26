import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Item } from '../../../../../../../../app/core/shared/item.model';
import { isDefined } from '@ng-bootstrap/ng-bootstrap/util/util';

export interface CitationFormat {
  value: string;
  label: string;
}

@Component({
  selector: 'ds-citation-export',
  templateUrl: './citation-export.component.html',
  styleUrls: ['./citation-export.component.scss']
})

/**
 * Component to export the citation of an item in different formats
 * Oriol Olivé
 */
export class CitationExportComponent implements OnInit {

  @Input() item: Item;

  // copiat de D:\dspace7-source\dspace-angular-ub\src\app\item-page\field-components\collections\collections.component.ts
  label = 'citation-export.title';

  constructor(private clipboard: Clipboard) {}

  //electedFormat = 'apa';
  selectedFormat = 'iso690';
  isExpanded = true;

  locale = 'ca'; // TODO: get the locale from the user


  citationFormats: CitationFormat[] = [
    { value: 'iso690', label: 'ISO 690' },
    { value: 'apa', label: 'APA' },
    { value: 'mla', label: 'MLA' },
    { value: 'chicago', label: 'Chicago/Turabian' },
    { value: 'vancouver', label: 'Vancouver' },
    //{ value: 'turabian', label: 'Turabian' },
    { value: 'ieee', label: 'IEEE' },
    { value: 'bibtex', label: 'BibTeX' },
    { value: 'ris', label: 'RIS' }
  ];

   /**
   * Get the user's locale from the browser.
   *
   * The browser provides a property called `navigator.language` (or `navigator.languages`)
   * which tells us the user's preferred language/locale setting.
   *
   * Example values: 'en-US', 'ca', 'es-ES'
   */
   getUserLocale(): string {
    // navigator.language returns the browser's primary language setting
    // If not available, default to 'ca_ES'
    if (typeof navigator === 'undefined') return 'ca';

    let locale = (navigator.language || (navigator.languages && navigator.languages[0]) || 'ca').toString();
    locale = locale.substring(0, 2);
    return locale;
  }

  ngOnInit(): void {
    // Set the locale property to the user's browser locale on component initialization
    this.locale = this.getUserLocale();
    // You can add other initialization code here if needed
  }


  /**
   * Toggle the expanded state of the citation export
   */
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Change the selected format
   */
  onFormatChange(format: string): void {
    this.selectedFormat = format;
  }

  /**
   * Download the citation in the selected format
   */
  downloadCitation(): void {
    const citation = this.generateCitation(this.selectedFormat);
    const filename = this.getFilename(this.selectedFormat);

    this.downloadFile(citation, filename);
  }

  /**
   * Get the citation preview in the selected format
   */
  getCitationPreview(): string {
    return this.generateCitation(this.selectedFormat);
  }

  /**
   * Copy the citation to the clipboard
   */
  copyToClipboard(): void {
    const citation = this.generateCitation(this.selectedFormat);
    const successful = this.clipboard.copy(citation);

    if (successful) {
      // TODO: Add success notification
      console.log('Citation copied to clipboard');
    } else {
      // TODO: Add error notification
      console.error('Failed to copy citation to clipboard');
    }
  }

/*
-- per cada item: primer dc.type i primer dc.relation.ispartof
select
i.uuid
,tt.tip
,m42.text_value
from item i
left join metadatavalue m42 on i.uuid=m42.dspace_object_id and m42.metadata_field_id=42 and m42.place=0
left join (select dspace_object_id, split_part(string_agg(split_part(text_value, '/', -1),' ' order by place), ' ', 1) tip
from metadatavalue where metadata_field_id=66 and text_value not ilike '%version' and text_value not like '%/' and text_value not like '%dataset' and text_value not like '%image' group by dspace_object_id) tt on i.uuid=tt.dspace_object_id
where i.in_archive=true and i.withdrawn=false;
*/


  types = [
    'article',
    'bachelorthesis',
    'masterthesis',
    'doctoralthesis',
    'book',
    'bookpart',
    'review',
    'conferenceobject',
    'lecture',
    'workingpaper',
    'preprint',
    'report',
    'annotation',
    'contributiontoperiodical',
    'patent',
    'other',
  ];

  private getType(): string {
    for (const type of this.item.allMetadata('dc.type')) {
      let parts = type.value.split('/');
      let last = parts[parts.length - 1];
      last = last.toLowerCase();
      if (this.types.includes(last)) {
        return last;
      }
    }
    return 'article';
  }


  /**
   * Generate the citation in the selected format
   * @param format
   * @returns text
   */
  private generateCitation(format: string): string {
    switch (format) {
      case 'iso690':
        return this.generateISO690();
      case 'apa':
        return this.generateAPA();
      case 'mla':
        return this.generateMLA();
      case 'chicago':
        return this.generateChicago();
      case 'vancouver':
        return this.generateVancouver();
      case 'turabian':
        return this.generateTurabian();
      case 'ieee':
        return this.generateIEEE();
      case 'bibtex':
        return this.generateBibTeX();
      case 'ris':
        return this.generateRIS();
      default:
        return this.generateAPA();
    }
  }

  /**
   * Generate the ISO 690 citation
   * @returns text
   * https://en.wikipedia.org/wiki/ISO_690
   * https://biblioteca.uoc.edu:8080/ca/plana/Estil-ISO-690/
   */
  private generateISO690(): string {

    // TODO: Implement ISO 690 citation generation
    /*
    The ISO 690 citation format is quite complex and can vary depending on the type of resource (book, journal article, website, etc.).
    Below is a simplified implementation that covers some common metadata fields.
    You may need to adjust the formatting based on specific requirements or edge cases.
    */
    const authors = this.item.allMetadataValues('dc.contributor.author');
    let title = this.item.firstMetadataValue('dc.title');
    //dc.relation.ispartof	Collectanea Botanica, 1946, vol. 1, num. 8, p. 95-105
    const relationIsPartOf = this.item.firstMetadataValue('dc.relation.ispartof'); // metadatavalue.metadatafield_id = 42
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const handle = this.item.firstMetadataValue('dc.identifier.uri');
    const issn = this.item.firstMetadataValue('dc.identifier.issn');
    const isbn = this.item.firstMetadataValue('dc.identifier.isbn');
    const type = this.getType();

    let citation = '';

    // today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // [consulta: 29 de noviembre de 2019]
    // Use toLocaleString to get the month name in the user's language
    const monthName = today.toLocaleString(this.locale, { month: 'long' });
    let formattedDate = '';
    if (this.locale == 'ca') {
      formattedDate = `[consulta: ${day} de ${monthName} de ${year}]`;
    } else if (this.locale == 'es') {
      formattedDate = `[consulta: ${day} de ${monthName} de ${year}]`;
    } else {
      formattedDate = `[consulted: ${day} of ${monthName} of ${year}]`;
    }

    citation += this.formatAuthorsISO690(authors);

    // title
    if (title) {
      if (!title.endsWith('.')) {
        title += '.';
      }
      if (!relationIsPartOf) {
        title = `<i>${title}</i>`;
      }
      citation += `${title} `;
    }

    if (relationIsPartOf) {
      const parts = relationIsPartOf.split(',');

      const journalTitle = parts[0] || '';
      if (journalTitle) {
        citation += `<i>${journalTitle}</i>. `;
      }

      let year = parts[1] || '';
      if (year) {
        year = year.trim();
        citation += `${year}. `;
      }

      let volume = parts[2] || '';
      // if . is in the volume, remove it
      if (volume.includes('.')) {
        volume = volume.split('.')[1];
        // remove the first space
        volume = volume.trim();
      }
      if (volume) {
        citation += `Vol. ${volume}, `;
      }

      let num = 'num';
      let pag = 'pags';
      if (this.locale == 'ca') {
        num = 'núm';
        pag = 'pàgs';
      } else if (this.locale == 'es') {
        num = 'nº';
        pag = 'págs';
      }

      let number = parts[3] || '';
      // if . is in the number, remove it
      if (number.includes('.')) {
        number = number.split('.')[1];
        // remove the first space
        number = number.trim();
      }
      if (number) {
        number = number.trim();
        citation += `${num}. ${number}, `;
      }

      let pages = parts[4] || '';
      // if . is in the pages, remove it
      if (pages.includes('.')) {
        pages = pages.split('.')[1];
        // remove the first space
        pages = pages.trim();
      }
      if (pages) {
        pages = pages.trim();
        citation += `${pag}. ${pages}. `;
      }

      if (citation.endsWith(', ')) {
        citation = citation.slice(0, -2);
        citation += '. ';
      }
    }

    // issn
    if (issn) {
      citation += `ISSN ${issn}. `;
    }

    // isbn
    if (isbn) {
      citation += `ISBN ${isbn}. `;
    }

    // consulted
    if (formattedDate) {
      citation += `${formattedDate}. `;
    }

    // handle
    if (handle) {
      if (this.locale == 'ca') {
        citation += `Disponible a: ${handle}`;
      } else if (this.locale == 'es') {
        citation += `Disponible en: ${handle}`;
      } else {
        citation += `Available at: ${handle}`;
      }
    }

    return citation;
  }

  /**
   * iso690 text to html
   * @param text
   * @returns html
   */
  private textToHtml(text: string): string {
    return text.replace(/_/g, '<i>');
  }

  /**
   * Generate the APA citation
   * @returns text
   */
  private generateAPA(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    let title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');
    const relationIsPartOf = this.item.firstMetadataValue('dc.relation.ispartof'); // metadatavalue.metadatafield_id = 42

    let citation = '';

    if (authors.length > 0) {
      citation += this.formatAuthorsAPA(authors) + ' ';
    }

    if (date) {
      citation += `(${new Date(date).getFullYear()}). `;
    }

    if (title) {
      if (!title.endsWith('.')) {
        title += '.';
      }
      citation += `${title} `;
    }

    if (relationIsPartOf) {
      const parts = relationIsPartOf.split(',');
      const journalTitle = parts[0] ? parts[0].trim() : '';
      const journalYear = parts[1] ? parts[1].trim() : '';
      const volume = parts[2] ? parts[2].replace(/vol/i, '').replace(/v/i, '').replace('.', '').trim() : '';
      let number = parts[3] ? parts[3].replace(/(num|núm|no|n)/i, '').replace('.', '').trim() : '';
      let pages = parts[4] ? parts[4].replace(/(pág|pàg|pag|pp|p)/i, '').replace('.', '').trim() : '';

      if (journalTitle) {
        citation += `<i>${journalTitle}</i>, `;
      }

      if (volume) {
        citation += `${volume}`;
      }

      if (number) {
        citation += `(${number})`;
      }

      if (pages) {
        if (!citation.endsWith(' ')) {
          citation += ', ';
        }
        citation += `${pages}`;
      }
      citation = citation.replace(/,\s*$/, '');

      if (!citation.endsWith('.')) {
        citation += '.';
      }
      citation += ' ';
    }

    if (publisher) {
      citation += publisher;
      if (!publisher.endsWith('.')) {
        citation += '.';
      }
      citation += ' ';
    }

    if (doi) {
      citation += `https://doi.org/${doi}`;
    } else if (uri) {
      citation += uri;
    }

    return citation;
  }

  /**
   * Generate the MLA citation
   * @returns text
   */
  private generateMLA(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    let title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');
    const relationIsPartOf = this.item.firstMetadataValue('dc.relation.ispartof');

    let citation = '';

    if (authors.length > 0) {
      citation += this.formatAuthorsMLA(authors) + ' ';
    }

    if (title) {
      if (!title.endsWith('.')) {
        title += '.';
      }
      citation += `"${title}" `;
    }

    if (relationIsPartOf) {
      const parts = relationIsPartOf.split(',');
      const journalTitle = parts[0] ? parts[0].trim() : '';
      const journalYear = parts[1] ? parts[1].trim() : '';
      const volume = parts[2] ? parts[2].trim() : '';
      let number = parts[3] ? parts[3].trim() : '';
      let pages = parts[4] ? parts[4].trim() : '';

      if (journalTitle) {
        citation += `${journalTitle}`;
      }

      if (volume) {
        citation += `, ${volume}`;
      }

      if (number) {
        citation += `, ${number}`;
      }

      if (journalYear) {
        citation += `, ${journalYear}`;
      }

      if (pages) {
        citation += `, ${pages}`;
      }

      citation = citation.trim();
      if (!citation.endsWith('.')) {
        citation += '.';
      }
      citation += ' ';
    }

    if (publisher) {
      citation += `${publisher}, `;
    }

    if (date) {
      citation += `${new Date(date).getFullYear()}. `;
    }

    if (uri) {
      citation += uri;
    }

    return citation;
  }

  /**
   * Generate the Chicago citation
   */
  private generateChicago(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    let title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');

    let citation = '';

    if (authors.length > 0) {
      citation += this.formatAuthorsChicago(authors) + ' ';
    }

    if (title) {
      if (!title.endsWith('.')) {
        title += '.';
      }
      citation += `"${title}" `;
    }

    if (publisher) {
      citation += `${publisher}, `;
    }

    if (date) {
      citation += `${new Date(date).getFullYear()}. `;
    }

    if (uri) {
      citation += uri;
    }

    return citation;
  }

  private generateVancouver(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    let title = this.item.firstMetadataValue('dc.title');
    const relationIsPartOf = this.item.firstMetadataValue('dc.relation.ispartof');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');

    let citation = '';

    if (authors.length > 0) {
      citation += this.formatAuthorsVancouver(authors);
      if (!citation.endsWith('.')) {
        citation += '.';
      }
      citation += ' ';
    }

    if (title) {
      if (!title.endsWith('.')) {
        title += '.';
      }
      citation += `${title} `;
    }

    if (relationIsPartOf) {
      const parts = relationIsPartOf.split(',');
      const journalTitle = parts[0] ? parts[0].trim() : '';
      const journalYear = parts[1] ? parts[1].trim() : '';
      const volume = parts[2] ? parts[2].replace(/vol/i, '').replace(/v/i, '').replace('.', '').trim() : '';
      let number = parts[3] ? parts[3].replace(/(num|núm|no|n)/i, '').replace('.', '').trim() : '';
      let pages = parts[4] ? parts[4].replace(/(pág|pàg|pag|pp|p)/i, '').replace('.', '').trim() : '';

      if (journalTitle) {
        citation += `<i>${journalTitle}</i>. `;
      }

      if (journalYear) {
        citation += `${journalYear}`;
      }

      if (volume) {
        citation += `;${volume}`;
      }

      if (number) {
        citation += `(${number})`;
      }

      if (pages) {
        citation += `:${pages}`;
      }

      citation = citation.trim();
      if (!citation.endsWith('.')) {
        citation += '.';
      }
      citation += ' ';
    } else if (date) {
      const year = new Date(date).getFullYear();
      citation += `${year}. `;
    }

    if (!citation.endsWith(' ')) {
      citation += ' ';
    }

    if (doi) {
      citation += `doi:${doi}.`;
    } else if (uri) {
      if (this.locale == 'ca') {
        citation += 'Disponible a: ';
      } else if (this.locale == 'es') {
        citation += 'Disponible en: ';
      } else {
        citation += 'Available from: ';
      }
      citation += `${uri}.`;
    }

    return citation.trim();
  }

  private formatAuthorsVancouver(authors: string[]): string {
    if (authors.length === 0) {
      return '';
    }

    const formatted = authors.slice(0, 6).map(author => {
      const parts = author.split(',');
      const lastName = parts[0].trim();
      const firstNames = parts[1] ? parts[1].trim() : '';
      const initials = firstNames
        .split(/\s+/)
        .filter(Boolean)
        .map(name => `${name.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`)
        .join('');
      return initials ? `${lastName} ${initials}` : lastName;
    });

    const authorList = formatted.join(', ');
    return authors.length > 6 ? `${authorList}, et al` : authorList;
  }

  private generateTurabian(): string {
    // Turabian is the same as Chicago??
    return this.generateChicago();
  }

  /**
   * Generate the IEEE citation
   */
  private generateIEEE(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    const title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');

    let citation = '';

    if (authors.length > 0) {
      citation += this.formatAuthorsIEEE(authors) + ', ';
    }

    if (title) {
      citation += `"${title}," `;
    }

    if (publisher) {
      citation += `${publisher}, `;
    }

    if (date) {
      citation += `${new Date(date).getFullYear()}. `;
    }

    if (doi) {
      citation += `doi: ${doi}`;
    } else if (uri) {
      citation += `[Online]. Available: ${uri}`;
    }

    return citation;
  }

  /**
   * Generate the BibTeX citation
   */
  private generateBibTeX(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    const title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');

    let citation = '@article{';

    // Generate a citation key
    const firstAuthor = authors.length > 0 ? authors[0].split(',')[0].replace(/\s+/g, '').toLowerCase() : 'unknown';
    const year = date ? new Date(date).getFullYear() : 'unknown';
    citation += `${firstAuthor}${year},\n`;

    if (title) {
      citation += `  title={${title}},\n`;
    }

    if (authors.length > 0) {
      citation += `  author={${authors.join(' and ')}},\n`;
    }

    if (date) {
      citation += `  year={${new Date(date).getFullYear()}},\n`;
    }

    if (publisher) {
      citation += `  publisher={${publisher}},\n`;
    }

    if (doi) {
      citation += `  doi={${doi}},\n`;
    } else if (uri) {
      citation += `  url={${uri}},\n`;
    }

    citation += '}';

    return citation;
  }

  /**
   * Generate the RIS citation
   */
  private generateRIS(): string {
    const authors = this.item.allMetadataValues('dc.contributor.author');
    const title = this.item.firstMetadataValue('dc.title');
    const date = this.item.firstMetadataValue('dc.date.issued');
    const publisher = this.item.firstMetadataValue('dc.publisher');
    const doi = this.item.firstMetadataValue('dc.identifier.doi');
    const uri = this.item.firstMetadataValue('dc.identifier.uri');

    let citation = 'TY  - GEN\n';

    if (title) {
      citation += `TI  - ${title}\n`;
    }

    authors.forEach(author => {
      citation += `AU  - ${author}\n`;
    });

    if (date) {
      citation += `PY  - ${new Date(date).getFullYear()}\n`;
    }

    if (publisher) {
      citation += `PB  - ${publisher}\n`;
    }

    if (doi) {
      citation += `DO  - ${doi}\n`;
    }

    if (uri) {
      citation += `UR  - ${uri}\n`;
    }

    citation += 'ER  - \n';

    return citation;
  }

  /**
   * Format the authors for ISO 690 citation
   */
  private formatAuthorsISO690(authors: string[]): string {
    if (authors.length === 0) {
      return '';
    }
    let formattedAuthors = '';
    let count = 0;
    let separator = ', ';
    for (const author of authors) {
      count++;
      if (count === authors.length - 1) {
        if (this.locale == 'ca') {
          separator = ' i ';
        } else if (this.locale == 'es') {
          separator = ' y ';
        } else {
          separator = ' and ';
        }
      } else if (count === authors.length) {
        separator = '';
      }
      const parts = author.split(',');
      if (parts.length > 1) {
        const lastName = parts[0].trim();
        const firstName = parts[1].trim();
        // formattedAuthors += `${lastName.toUpperCase()}, ${firstName[0].toUpperCase() + firstName.slice(1).toLowerCase()}`;
        // formattedAuthors += `${lastName.toUpperCase()}, ${firstName.charAt(0).toUpperCase()}.`;
        formattedAuthors += `${lastName.toUpperCase()}, ${firstName}`;
      } else {
        formattedAuthors += author;
      }
      // si hi ha més de tres autors, només mostrar el primer
      if (authors.length > 3 ) {
        formattedAuthors += ', et al';
        break;
      };
      formattedAuthors += separator;
    }
    if (!formattedAuthors.endsWith('.')) {
      formattedAuthors += '.';
    }
    return formattedAuthors + ' ';
  }

  /**
   * Format the authors for APA citation
   */
  private formatAuthorsAPA(authors: string[]): string {
    if (authors.length === 1) {
      return this.formatSingleAuthorAPA(authors[0]);
    } else if (authors.length === 2) {
      return `${this.formatSingleAuthorAPA(authors[0])}, & ${this.formatSingleAuthorAPA(authors[1])}`;
    } else if (authors.length > 2) {
      const formattedAuthors = authors.slice(0, -1).map(author => this.formatSingleAuthorAPA(author));
      return `${formattedAuthors.join(', ')}, & ${this.formatSingleAuthorAPA(authors[authors.length - 1])}`;
    }
    return '';
  }

  /**
   * Format the authors for MLA citation
   */
  private formatAuthorsMLA(authors: string[]): string {
    if (authors.length === 1) {
      return this.formatSingleAuthorMLA(authors[0]);
    } else if (authors.length === 2) {
      return `${this.formatSingleAuthorMLA(authors[0])}, and ${this.formatSingleAuthorMLA(authors[1])}`;
    } else if (authors.length > 2) {
      return `${this.formatSingleAuthorMLA(authors[0])}, et al.`;
    }
    return '';
  }

  /**
   * Format the authors for Chicago citation
   */
  private formatAuthorsChicago(authors: string[]): string {
    if (authors.length === 1) {
      return this.formatSingleAuthorChicago(authors[0]);
    } else if (authors.length === 2) {
      return `${this.formatSingleAuthorChicago(authors[0])}, and ${this.formatSingleAuthorChicago(authors[1])}`;
    } else if (authors.length > 2) {
      return `${this.formatSingleAuthorChicago(authors[0])}, et al.`;
    }
    return '';
  }

  /**
   * Format the authors for IEEE citation
   */
  private formatAuthorsIEEE(authors: string[]): string {
    if (authors.length === 1) {
      return this.formatSingleAuthorIEEE(authors[0]);
    } else if (authors.length <= 3) {
      const formattedAuthors = authors.map(author => this.formatSingleAuthorIEEE(author));
      return formattedAuthors.join(', ');
    } else {
      return `${this.formatSingleAuthorIEEE(authors[0])}, et al.`;
    }
  }

  /**
   * Format single author for APA citation
   */
  private formatSingleAuthorAPA(author: string): string {
    const parts = author.split(',');
    if (parts.length >= 2) {
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      return `${lastName}, ${firstName.charAt(0)}.`;
    }
    return author;
  }

  /**
   * Format single author for MLA citation
   */
  private formatSingleAuthorMLA(author: string): string {
    const parts = author.split(',');
    if (parts.length >= 2) {
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      return `${lastName}, ${firstName}`;
    }
    return author;
  }

  /**
   * Format single author for Chicago citation
   */
  private formatSingleAuthorChicago(author: string): string {
    const parts = author.split(',');
    if (parts.length >= 2) {
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      return `${lastName}, ${firstName}`;
    }
    return author;
  }

  /**
   * Format the authors for IEEE citation
   */
  private formatSingleAuthorIEEE(author: string): string {
    const parts = author.split(',');
    if (parts.length >= 2) {
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      return `${firstName.charAt(0)}. ${lastName}`;
    }
    return author;
  }

  /**
   * Get the filename for the citation
   * @param format
   * @returns filename
   */
  private getFilename(format: string): string {
    const title = this.item.firstMetadataValue('dc.title') || 'citation';
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);

    const extensions = {
      'apa': 'txt',
      'mla': 'txt',
      'chicago': 'txt',
      'vancouver': 'txt',
      'turabian': 'txt',
      'ieee': 'txt',
      'bibtex': 'bib',
      'ris': 'ris'
    };

    return `${sanitizedTitle}_${format}.${extensions[format] || 'txt'}`;
  }

  /*
  * Download the citation to the user's computer
  * @param content
  * @param filename
  */
  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
