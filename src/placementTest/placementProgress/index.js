import React from 'react';

export default class PlacementProgress extends React.Component {
    render() {
        return <div className="profile-progress placement-test">
            <div className={this.props.step > 1 ? 'done' : (this.props.step === 1 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>1</p>
            </div>
            <div className={this.props.step > 2 ? 'done' : (this.props.step === 2 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>2</p>
            </div>
            <div className={this.props.step > 3 ? 'done' : (this.props.step === 3 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>3</p>
            </div>
            <div className={this.props.step > 4 ? 'done' : (this.props.step === 4 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>4</p>
            </div>
            <div className={this.props.step > 5 ? 'done' : (this.props.step === 5 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>5</p>
            </div>
            <div className={this.props.step > 6 ? 'done' : (this.props.step === 6 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>6</p>
            </div>
            <div className={this.props.step > 7 ? 'done' : (this.props.step === 7 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left"></div>
                    <div className="circle"></div>
                </div>
                <p>7</p>
            </div>
            <div className={this.props.step > 8 ? 'done' : (this.props.step === 8 ? 'active' : '' )}>
                <div className="dot">
                    <div className="line-left line-left-last"></div>
                    <div className="circle"></div>
                </div>
                <p>8</p>
            </div>
        </div>
    }
}