import {Map, List} from 'immutable';
import {createSelector} from "reselect";

export const NAME = 'TEST';
//-----------------------------------------------------------------------------
//	Actions
//-----------------------------------------------------------------------------
export const SORT							= Symbol('SORT');

export function sort(sorted, key, asc) {
	return {
		type: SORT,
		sorted: sorted,
		key: key,
		asc: asc,
	}
}
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------

const iniSortCondition = {
	sorted: false,
	key: null,
	asc: false,
}

const iniCols = [
	{
		key: "name",
		name: "名前",
		sortable: false,
	},
	{
		key: "sex",
		name: "性別",
		sortable: true,
	},
	{
		key: "age",
		name: "年齢",
		sortable: true,
	},
]

const iniDataList = [
	{
		name: "山田 太郎",
		sex: "男",
		age: 17
	},
	{
		name: "山田 花子",
		sex: "女",
		age: 15
	},
	{
		name: "山田 三郎",
		sex: "男",
		age: 9
	},
	{
		name: "山田 次郎",
		sex: "男",
		age: 14
	},
]

const initialState = Map({
	cols: List(iniCols),
	sortCondition: Map(iniSortCondition),
	dataList: List(iniDataList)
});

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getCols = (state) => {
	return state[NAME].get("cols");
}

export const getDataList = (state) => {
	return state[NAME].get("dataList");
}

export const getSortCondition = (state) => {
	return state[NAME].get("sortCondition");
}

const sortDataList = (sortCondition, dataList) => {
	const {sorted, key, asc} = sortCondition.toJS();
	return sorted ? dataList.sort((a, b) => {
		if(a[key] < b[key]) {return asc ? -1 : 1;}
		if(a[key] > b[key]) {return asc ? 1 : -1;}
		if(a[key] === b[key]) {return 0;}
	}) : dataList;
}

export const getSortedDataList = createSelector(
	getSortCondition,
	getDataList,
	sortDataList
);

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const testReducer = (state = initialState, action) => {
	switch (action.type) {
		case SORT:
			return state.withMutations(s=>{
				s.setIn(["sortCondition", "sorted"], action.sorted)
				.setIn(["sortCondition", "key"], action.key)
				.setIn(["sortCondition", "asc"], action.asc)
			});
		default:
			return state;
	}
}

export default testReducer;