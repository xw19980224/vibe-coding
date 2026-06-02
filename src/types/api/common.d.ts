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

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageNumber' | 'pageSize'>;

    /**
     * enable status
     *
     * - 0: disabled
     * - 1: enabled
     */
    type EnableStatus = 0 | 1;

    /**
     * sort type
     *
     * - asc: ascending
     * - desc: descending
     */
    type SortType = 'ASC' | 'DESC';

    type CommonRecord<ID = number, T = any> = {
      /** record id */
      id: ID;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: number;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: number;
      /** record status */
      status: EnableStatus | undefined;
      /** record version */
      version: number;
    } & T;
  }
}
