import React, {Component} from 'react';
import Resources from '../../resources';

class LanguageSelector extends Component {
    constructor(props) {
        super();

        Resources.setCulture(props.currentCulture);

        this.state = {
            currentCulture: props.currentCulture
        }
    }

    changeCultureTo(event, culture) {
        event.preventDefault();

        Resources.setCulture(culture);

        this.setState({
            currentCulture: culture
        }, () => {
            this.props.cultureChanged();
        });
    }

    render() {
        return (
            <div className="language">
                <br/>
                <br/>
                <br/>
                <a href="" onClick={(event) => this.changeCultureTo(event, 'en-US')}
                   className={this.state.currentCulture === 'en-US' ? 'ui button green' : 'ui button grey'}>
                    {Resources.getInstance().languageUs}
                </a>
                <br/>
                <a href="" onClick={(event) => this.changeCultureTo(event, 'zh-CN')} style={{margin: '1em 0'}}
                   className={this.state.currentCulture === 'zh-CN' ? 'ui button green' : 'ui button grey'}>
                    {Resources.getInstance().languageCN}
                </a>
                <br/>
            </div>
        );
    }
}

export default LanguageSelector;