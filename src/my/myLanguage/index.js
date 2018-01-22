import React, {Component} from 'react';
import CultureSelector from './languageSelector';

class LanguageSelector extends Component {
    constructor() {
        super();

        this.state = {
            currentCulture: 'zh-CN'
        }
    }

    async componentDidMount() {
        //get language from DB

    }

    render() {
        return (
            <div className="language">
                <CultureSelector currentCulture={this.state.currentCulture}
                                 cultureChanged={() => this.forceUpdate()}/>
            </div>
        );
    }
}

export default LanguageSelector;