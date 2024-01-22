import { DateParserService } from '../services/date-parser.service';

describe('DateParserService', () => {
  let dateParserService: DateParserService;

  beforeEach(() => {
    dateParserService = new DateParserService();
  });

  it('should parse date string properly with and without time', () => {
    const dateString = '20.12.2023 - 21.12.2023';

    const { startDate, endDate } = dateParserService.parseEventDate(dateString);

    expect(endDate instanceof Date).toBeTrue();
    expect(startDate instanceof Date).toBeTrue();
    expect(endDate.toISOString()).toEqual(new Date(2023, 11, 21).toISOString());
  });

  it('should parse date string properly with time', () => {
    const dateString = '20.12.2023 19:00';
    const { endDate } = dateParserService.parseEventDate(dateString);

    expect(endDate instanceof Date).toBeTrue();

    expect(endDate.toISOString()).toEqual(new Date(2023, 11, 20, 19, 0).toISOString());
  });

  it('should parse date string properly without time', () => {
    const dateString = '20.12.2023';

    const { endDate } = dateParserService.parseEventDate(dateString);

    expect(endDate instanceof Date).toBeTrue();
    expect(endDate.toISOString()).toEqual(new Date(2023, 11, 20).toISOString());
  });
});
