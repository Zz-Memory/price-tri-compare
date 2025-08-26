import axios from '@/services/config';

export async function fetchSavingTips({ page = 1, pageSize = 10 } = {}) {
  const { data } = await axios.get('/saving-tips/list', { params: { page, pageSize } });
  const payload = data?.data || {};
  return {
    list: payload.list || [],
    page: payload.page || page,
    pageSize: payload.pageSize || pageSize,
    hasMore: !!payload.hasMore,
  };
}