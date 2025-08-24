import { Checkbox } from 'react-vant';

export default function AgreementCheck({ checked, onChange, brandColor }) {
  return (
    <div className="w-full mt-6 flex items-center text-xs text-gray-500">
      <Checkbox
        checked={checked}
        onChange={onChange}
        iconSize={14}
        checkedColor={brandColor}
        shape="square"
      />
      <span className="ml-2">
        我已阅读并同意
        <a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>用户服务协议</a>
        、<a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>隐私政策</a>
      </span>
    </div>
  );
}