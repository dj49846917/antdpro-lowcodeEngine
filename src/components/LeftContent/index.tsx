import '@/components/LeftContent/index.less'
import { ENU_IMG } from '@/constant/img'
import { useModel } from 'umi';

type LeftContentProps = {}

function LeftContent(props: LeftContentProps) {
  const { initialState } = useModel('@@initialState');
  return (
    <div className='layout-left'>
      <div className='layout-header'></div>
      <div className='layout-content'>
        <div className='content-user'>
          <img src={initialState?.currentUser?.image || ENU_IMG.defaultUserIcon_0} />
          <p>{initialState?.currentUser?.fullName}</p>
        </div>
        {/* <div className='content-company'>
          <div className='tip'>您已加入</div>
          <div className='name'>非比寻常（上海）有限公司</div>
          <div className='days-out'>
            <p>43&nbsp;&nbsp;天</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default LeftContent