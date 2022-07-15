import _ from 'underscore';

export default {
    data() {
        return {
            cond: null,
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            sorter: {}
        };
    },

    computed: {
        params():any {
            return {
                ...this.pagination,
                total: undefined,
                ...this.cond
            };
        }
    },

    methods: {
        onSearch({values} = {}) {
            this.pagination.pageNo = 1;
            this.cond = _.omit(values, value => value === '');
            this.onRefresh();
        },

        onTableChange({pageSize, pageNo}, sorter) {
            Object.assign(this.pagination, {pageSize, pageNo});
            this.sorter = sorter;
            this.onRefresh();
        }
    }
};
