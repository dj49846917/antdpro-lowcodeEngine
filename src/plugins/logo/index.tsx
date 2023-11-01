import React from 'react';
import './index.scss';
import { PluginProps } from '@alilc/lowcode-types';
import { ENU_IMG } from "@/constant/img";

export interface IProps {
  logo?: string;
  href?: string;
}

const Logo: React.FC<IProps & PluginProps> = (props): React.ReactElement => {
  return (
    <div className="lowcode-plugin-logo">
      <a
        target="blank"
        href={props.href || '/'}
      >
        <img src={ENU_IMG.logo_deloitte} className="logo" />
        <span className='title'>EasyDP易码低代码平台</span>
      </a>
    </div>
  );
};

export default Logo;
