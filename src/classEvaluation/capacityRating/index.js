import React, {Component} from 'react';
import './index.css';

export default class CapacityRating extends Component{
    constructor(){
        super();

        this.state = {
            rating: {
                Fluency: 4,
                Vocabulary: 1,
                Grammar: 5,
                Pronunciation: 2
            }
        };
    }

    componentDidMount(){
        //get score from DB
        let canvas = document.getElementById('rating-map');
        let ctx = canvas.getContext('2d');
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        this.drawCircle(ctx, 'rgba(255, 210, 0, 0.2)', canvas.width*.5, centerX, centerY);
        this.drawCircle(ctx, 'rgba(255, 210, 0, 0.4)', canvas.width*.4, centerX, centerY);
        this.drawCircle(ctx, 'rgba(255, 210, 0, 0.6)', canvas.width*.3, centerX, centerY);
        this.drawCircle(ctx, 'rgba(255, 210, 0, 0.8)', canvas.width*.2, centerX, centerY);
        this.drawCircle(ctx, 'rgb(255, 210, 0)', canvas.width*.1, centerX, centerY);
        this.drawLines(ctx, canvas.width, canvas.height);

        ctx.beginPath();
        Object.keys(this.state.rating).map((key) => {
            ctx.lineTo(this.getLocationByScore(this.state.rating[key], key, canvas.width, canvas.height).x, this.getLocationByScore(this.state.rating[key], key, canvas.width, canvas.height).y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        this.drawRegion(ctx, canvas.width, canvas.height);
    }

    drawCircle(context, color, radius, centerX, centerY, lineColor){
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = lineColor ? 0.5 : 1;
        context.strokeStyle = lineColor ? lineColor : '#fff';
        context.stroke();
    }

    drawLines(context, width, height){
        context.beginPath();
        context.moveTo(0, width/2);
        context.lineTo(height, width/2);
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.moveTo(height/2, 0);
        context.lineTo(height/2, width);
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        context.stroke();
    }

    getLocationByScore(score, key, width, height){
        let radius = Number(score*20);
        let length = Math.sqrt(radius*radius/2);

        switch (key){
            case 'Fluency':
                return {x: width/2 - length, y: height/2 - length};
                break;
            case 'Vocabulary':
                return {x: width/2 - length, y: height/2 + length};
                break;
            case 'Grammar':
                return {x: width/2 + length, y: height/2 + length};
                break;
            case 'Pronunciation':
                return {x: width/2 + length, y: height/2 - length};
                break;
            default: break;
        }
    }

    drawRegion(ctx, width, height){
        let Fluency = this.getLocationByScore(this.state.rating.Fluency, 'Fluency', width, height);
        let Vocabulary = this.getLocationByScore(this.state.rating.Vocabulary, 'Vocabulary', width, height);
        let Grammar = this.getLocationByScore(this.state.rating.Grammar, 'Grammar', width, height);
        let Pronunciation = this.getLocationByScore(this.state.rating.Pronunciation, 'Pronunciation', width, height);

        console.log(Fluency);
        console.log(Vocabulary);
        console.log(Grammar);
        console.log(Pronunciation);

        this.drawCircle(ctx, '#fff', 3, Fluency.x, Fluency.y, '#000');
        this.drawCircle(ctx, '#fff', 3, Vocabulary.x, Vocabulary.y, '#000');
        this.drawCircle(ctx, '#fff', 3, Grammar.x, Grammar.y, '#000');
        this.drawCircle(ctx, '#fff', 3, Pronunciation.x, Pronunciation.y, '#000');

        ctx.beginPath();
        ctx.moveTo(Fluency.x, Fluency.y);

        this.drawDashLine(ctx, Fluency.x, Fluency.y, Vocabulary.x, Vocabulary.y);
        this.drawDashLine(ctx, Vocabulary.x, Vocabulary.y, Grammar.x, Grammar.y);
        this.drawDashLine(ctx, Grammar.x, Grammar.y, Pronunciation.x, Pronunciation.y);
        this.drawDashLine(ctx, Pronunciation.x, Pronunciation.y, Fluency.x, Fluency.y);
    }

    drawDashLine(ctx, x1, y1, x2, y2, dashLen){
        dashLen = dashLen === undefined ? 2 : dashLen;
        let xpos = x2 - x1,
            ypos = y2 - y1,
            numDashes = Math.floor(Math.sqrt(xpos*xpos + ypos*ypos)/dashLen);

        for(let i = 2; i < numDashes; i++){
            if(i % 2 === 0){
                ctx.moveTo(x1+(xpos/numDashes)*i, y1+(ypos/numDashes)*i);
            }else{
                ctx.lineTo(x1+(xpos/numDashes)*i, y1+(ypos/numDashes)*i);
            }
        }

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    render(){
        return (
            <div className="rating-map">
                <div className="rating-content">
                    <div className="title">能力评分</div>
                    <div className="title-intro">相当于美国1年级小学水平</div>
                    <div className="canvas">
                        <canvas id="rating-map" width={200} height={200}>sorry, Canvas not supported</canvas>
                        <div className="tab tab-fluency">
                            <div className="score">{this.state.rating.Fluency}</div>
                            <span>Fluency</span>
                        </div>
                        <div className="tab tab-vocabulary">
                            <div className="score">{this.state.rating.Vocabulary}</div>
                            <span>Vocabulary</span>
                        </div>
                        <div className="tab tab-grammar">
                            <div className="score">{this.state.rating.Grammar}</div>
                            <span>Grammar</span>
                        </div>
                        <div className="tab tab-pronunciation">
                            <div className="score">{this.state.rating.Pronunciation}</div>
                            <span>Pronunciation</span>
                        </div>
                    </div>
                    <div className="score-intro">
                        评分标准说明
                    </div>
                </div>
            </div>
        )
    }
}