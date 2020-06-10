import { Effect, Reducer, Subscription } from 'umi';

import { EmployeeManagementState } from './data';
import {
  fetchEmployeeList,
  fetchDepartmentList,
  fetchRoleList,
  fetchAllDepartmentList,
  fetchInitEmployeeNumber,
  fetchAllRoleList,
} from './service';

interface EmployeeManagementModelType {
  namespace: string;
  state: EmployeeManagementState;
  effects: {
    fetchEmployeeList: Effect;
    fetchDepartmentList: Effect;
    fetchRoleList: Effect;
    fetchAllDepartmentList: Effect;
    fetchInitEmployeeNumber: Effect;
    fetchAllRoleList: Effect;
  };
  reducers: {
    save: Reducer;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const EmployeeManagementModel: EmployeeManagementModelType = {
  namespace: 'employeeManagement',

  state: {
    list: [],
    total: 0,
    departmentList: [],
    operationType: 'add',
    initEmployeeNumber: null,
    roleList: [],
  },

  effects: {
    // 获取员工列表
    *fetchEmployeeList({ payload }, { call, put }) {
      const response = yield call(fetchEmployeeList, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            list: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
    // 获取科室列表
    *fetchDepartmentList({ payload }, { call, put }) {
      const response = yield call(fetchDepartmentList, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            list: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
    // 获取角色列表
    *fetchRoleList({ payload }, { call, put }) {
      const response = yield call(fetchRoleList, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            list: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
    // 获取所有的科室数据
    *fetchAllDepartmentList({ payload }, { call, put }) {
      const response = yield call(fetchAllDepartmentList, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            departmentList: response.data,
          },
        });
      }
    },
    // 获取自动填充的员工编号
    *fetchInitEmployeeNumber({ _ }, { call, put }) {
      const response = yield call(fetchInitEmployeeNumber);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            initEmployeeNumber: response.data,
          },
        });
      }
    },
    // 获取所有的角色列表
    *fetchAllRoleList({ payload }, { call, put }) {
      const response = yield call(fetchAllRoleList);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: { roleList: response.data },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/system-settings/employee-management') {
          // 获取科室列表
          dispatch({
            type: 'fetchAllDepartmentList',
          });
        }
        if (pathname.includes('/system-settings/employee-management/add')) {
          // 改变新增与编辑共用页面的操作类型为add
          dispatch({
            type: 'save',
            payload: {
              operationType: 'add',
            },
          });
          // 新增/编辑员工信息
          if (
            pathname === '/system-settings/employee-management/add-employee' ||
            pathname === '/system-settings/employee-management/edit-employee'
          ) {
            // 获取所有科室列表
            dispatch({
              type: 'fetchAllDepartmentList',
            });
            // 获取所有角色列表
            dispatch({
              type: 'fetchAllRoleList',
            });
            // 新增员工信息
            if (
              pathname === '/system-settings/employee-management/add-employee'
            ) {
              // 获取自动填充的员工编号
              dispatch({
                type: 'fetchInitEmployeeNumber',
              });
            }
          }
        }
      });
    },
  },
};

export default EmployeeManagementModel;
