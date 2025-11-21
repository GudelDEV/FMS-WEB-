import { Select } from 'antd';

export default function FilterPeriode({ periode, onChange }) {
  return (
    <Select
      value={periode}
      style={{ width: 180 }}
      onChange={onChange}
      options={[
        { value: 'daily', label: 'Harian' },
        { value: 'weekly', label: 'Mingguan' },
        { value: 'monthly', label: 'Bulanan' },
      ]}
    />
  );
}
