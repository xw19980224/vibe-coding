/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      pageNumber: number;
      /** page size */
      pageSize: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    type CommonWaterfallItem<T = any> = {
      id: number;
      width: number;
      height: number;
      image: string;
    }
      & T;

    type WaterfallFunction<T = any> =
      (...args: any[]) => PaginatingQueryRecord<CommonWaterfallItem<T>>;

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageNumber' | 'pageSize'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';
  }
}
