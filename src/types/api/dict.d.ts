declare namespace Api {
  namespace System {

    type DictType = Common.CommonRecord<{
      /** 字典类型 */
      dictName: string;
      /** 字典类型 */
      dictType: string;
      /** 备注 */
      remark: string;
    }>;

    type DictTypeSearchParams = CommonType.RecordNullable<
      Pick<Api.System.DictType, 'dictName' | 'dictType' | 'status'> &
      Common.CommonSearchParams
    >;

    type DictTypePage = Common.PaginatingQueryRecord<DictType>;

    type ElTagType = 'primary' | 'success' | 'warning' | 'info' | 'danger';

    type ElButtonType = ElTagType | 'default';

    interface DictItem {
      label: string;

      /** 实际存储的值 */
      value: string;

      /** 状态标识 - '0': 启用, '1': 禁用 */
      status?: Api.Common.EnableStatus;

      /** Element Plus Tag 组件的类型 */
      elTagType?: ElTagType | ElButtonType;

      /** Element Plus Tag 组件的自定义类名 */
      elTagClass?: string;
    }

    /**
     * 字典结果接口
     */
    interface DataResult {
      /** 字典加载状态，false 代表加载完毕 */
      dictLoading: Ref<boolean>;

      /**
       * 索引签名，每个字典类型对应一个响应式数组
       * 通过字典类型名动态访问对应的字典数据
       */
      [key: string]: Ref<DictItem[]>;
    }

    type DictData = Common.CommonRecord<{
      /** 字典类型 */
      dictType: string;
      /** 字典名称 */
      dictLabel: string;
      /** 字典值 */
      dictValue: string;
      /** 排序 */
      sort: number;
      /** 颜色类型 */
      colorType: string;
      /** 样式类 */
      cssClass: string;
      /** 列表样式类 */
      listClass: string;
      /** 是否默认 */
      isDefault: 'Y' | 'N';
      /** 备注 */
      remark: string;
    }>;

    type DictDataSearchParams = CommonType.RecordNullable<
      Pick<Api.System.DictData, 'dictType' | 'dictLabel' | 'dictValue' | 'status'> &
      Common.CommonSearchParams
    >;

    type DictDataPage = Common.PaginatingQueryRecord<DictData>;
  }
}
