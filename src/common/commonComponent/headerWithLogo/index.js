import './index.css'
import React from 'react';
import QiniuDomain from '../../systemData/qiniuUrl';

export default (props) => <div className="header-with-logo">
    <div className="logo-without-back">
        <a style={{display: 'block', textDecoration: 'none'}}
           href={props.href}>
            <img src={QiniuDomain + "/new_buzz_logo.png"}
                 alt="Buzzbuzz Logo"/>
        </a>
    </div>
</div>
