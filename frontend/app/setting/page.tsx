import ActiveControl from './components/ActiveControl';
import GeneralConfig from './components/GeneralConfig';
import NotificationConfig from './components/NotificationConfig';
import FanSetting from './components/FanSetting'
import LightSetting from './components/LightSetting'
export default function Setting() {

    return (
      <div className = " flex flex-col ml-10 mr-20 gap-6 h-full">
        {/* ROW 1 */}
        <div className = "flex flex-5  gap-24">
          {/* Cấu hình chung */}
          <div className = "flex flex-col flex-2/5 gap-6  ">
            <GeneralConfig/>
          </div>
          {/* Đèn */}
          <div className = "flex flex-col  lex-col flex-3/5 gap-6 ">
            <LightSetting/>
          </div>
        </div>
        {/* ROW 2 */}
        <div className = "flex flex-4  gap-24">
          {/* Thông báo */}
          <div className = "flex flex-col flex-2/5  gap-6">
            <NotificationConfig/>
          </div>
          {/* Quạt */}
          <div className = "flex flex-col flex-3/5  gap-6">
            <FanSetting/>
          </div>
        </div>
      </div>
    )
  }