import React, { Component } from 'react';
import SearchBar from './search_bar';
import YTSearch from 'youtube-api-search';
import VideoList from './video_list'
import VideoDetail from './video_detail';
const API_KEY = 'AIzaSyBdVut9QCzqAHBzfDEh30yUp4E529som6s';

class Youtube extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            selectedVideo: null
        };

        this.videoSearch('');
    }

    videoSearch(searchTerm) {
        YTSearch({ key: API_KEY, term: searchTerm }, (data) => {
            console.log(data);
            this.setState({
                videos: data,
                selectedVideo: data[0]
            });
        });

    }
    render() {
        return (
            <div>
                <SearchBar onSearchTermChange={searchTerm => this.videoSearch(searchTerm)} />
                <VideoDetail video={this.state.selectedVideo} />
                <VideoList
                    onVideoSelect={userSelected => this.setState({ selectedVideo: userSelected })}
                    videos={this.state.videos} />
            </div>
        );
    }
}

export default Youtube;