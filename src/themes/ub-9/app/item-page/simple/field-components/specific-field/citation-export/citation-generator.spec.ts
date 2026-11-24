import type { Item } from '../../../../../../../../app/core/shared/item.model';
import type { MetadataValue } from '../../../../../../../../app/core/shared/metadata.models';
import { CitationGenerator } from './citation-generator';

describe('UB CitationGenerator', () => {
  function makeItem(metadata: Record<string, string[]>): jasmine.SpyObj<Item> {
    const item = jasmine.createSpyObj<Item>('Item', ['firstMetadataValue', 'allMetadataValues', 'allMetadata']);
    const values = (key: string | string[]): string[] => metadata[Array.isArray(key) ? key[0] : key] || [];
    item.firstMetadataValue.and.callFake((key) => values(key)[0]);
    item.allMetadataValues.and.callFake((key) => values(key));
    item.allMetadata.and.callFake((key) => values(key).map((value) => ({ value } as MetadataValue)));
    return item;
  }

  const metadata = {
    'dc.title': ['Estudi dels ecosistemes'],
    'dc.contributor.author': ['Garcia, Anna', 'Puig, Joan'],
    'dc.date.issued': ['2024-05-12'],
    'dc.relation.ispartof': ['Revista UB, 2024, vol. 12, num. 2, p. 10-20'],
    'dc.identifier.doi': ['10.1234/ub.2024'],
    'dc.identifier.uri': ['https://hdl.handle.net/2445/123'],
    'dc.identifier.citation': ['A manually entered citation that must not be used'],
  };

  it('generates APA from authors, title, date, journal and DOI without reading a stored citation', () => {
    const item = makeItem(metadata);
    const citation = new CitationGenerator(item, 'ca').generate('apa');
    expect(citation).toBe('Garcia, A., & Puig, J. (2024). Estudi dels ecosistemes. <i>Revista UB</i>, 12(2), 10-20. https://doi.org/10.1234/ub.2024');
    expect(item.firstMetadataValue).not.toHaveBeenCalledWith('dc.identifier.citation');
    expect(item.allMetadataValues).not.toHaveBeenCalledWith('dc.identifier.citation');
  });

  for (const format of ['iso690', 'apa', 'mla', 'chicago', 'vancouver', 'ieee', 'bibtex', 'ris']) {
    it(`generates ${format} without dc.identifier.citation`, () => {
      const { 'dc.identifier.citation': ignored, ...fields } = metadata;
      const citation = new CitationGenerator(makeItem(fields), 'ca').generate(format);
      expect(citation).toContain('Estudi dels ecosistemes');
      expect(citation.toLowerCase()).toContain('garcia');
      expect(citation).not.toContain('undefined');
      expect(citation).not.toContain('NaN');
    });
  }

  it('keeps machine-readable BibTeX and RIS fields and line breaks', () => {
    const generator = new CitationGenerator(makeItem(metadata));
    expect(generator.generate('bibtex')).toContain('  author={Garcia, Anna and Puig, Joan},\n');
    expect(generator.generate('bibtex')).toContain('  doi={10.1234/ub.2024},\n');
    expect(generator.generate('ris')).toContain('AU  - Garcia, Anna\nAU  - Puig, Joan\n');
    expect(generator.generate('ris')).toContain('DO  - 10.1234/ub.2024\n');
    expect(generator.generate('ris')).toContain('ER  - \n');
  });

  it('uses the handle when an APA citation has no DOI', () => {
    const { 'dc.identifier.doi': ignored, ...fields } = metadata;
    expect(new CitationGenerator(makeItem(fields)).generate('apa')).toContain('https://hdl.handle.net/2445/123');
  });

  it('handles missing optional metadata in every offered format', () => {
    const generator = new CitationGenerator(makeItem({ 'dc.title': ['Només el títol'] }));
    for (const format of ['iso690', 'apa', 'mla', 'chicago', 'vancouver', 'ieee', 'bibtex', 'ris']) {
      const citation = generator.generate(format);
      expect(citation).toContain('Només el títol');
      expect(citation).not.toContain('undefined');
      expect(citation).not.toContain('NaN');
    }
  });

  it('uses the requested language for the ISO 690 author separator and access label', () => {
    const generator = new CitationGenerator(makeItem(metadata), 'es');
    expect(generator.generate('iso690')).toContain('GARCIA, Anna y PUIG, Joan');
    expect(generator.generate('iso690')).toContain('Disponible en:');
  });

  it('waits for the item input before generating a citation', () => {
    expect(new CitationGenerator(undefined).generate('apa')).toBe('');
  });
});
