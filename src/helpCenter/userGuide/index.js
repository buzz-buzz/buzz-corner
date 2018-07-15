import React from 'react';
import UserGuideModal from '../../common/commonComponent/modalUserGuide';

export default class UserGuide extends React.Component{
    render(){
        return <UserGuideModal modal={true} back={true} />
    }
}