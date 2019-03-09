import React from 'react';
import soundSketch from './sketches/SoundTest';
import p5 from 'p5';
import './Processing.css';

class Processing extends React.Component {
    componentDidMount() {
        this.canvas = new p5(soundSketch, "app-p5_container");
    }

    // shouldComponentUpdate() { // just in case :)
    //     return false;
    // }

    componentWillUnmount() {
        this.canvas.remove();
    }

    render(){
        return (
            <div id="app-p5_overlay">
                <div id="app-p5_container" />
            </div>
        )
    }
}

export default Processing;
