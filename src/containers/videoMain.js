/**
 * Created by user on 2017/8/4.
 */
import React from 'react';
import Topper from './topper';
import Footer from './footer'
import VideoDetail from '../components/vote/videoDetail';
export default class VideoMain extends React.Component{
    componentWillMount(){
        document.title = '视频详情';
    }
    render(){
        return(
            <div>
                <Topper/>
                <VideoDetail videosrc={this.props.params.userid}/>
                <Footer/>
            </div>
        )
    }
}
