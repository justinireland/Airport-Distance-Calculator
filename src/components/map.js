import React, { Component, PropTypes } from 'react';
import GoogleMap from 'react-google-map';
import GoogleMapLoader from 'react-google-maps-loader';
import config from '../data/config'
import {muiThemeStyle} from '../styles'

class Map extends Component {
    constructor(props){
        super(props);

        this.state = {
            googleMaps: {},
            map: {},
            coordinates: [],
            route: null
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.departing && !this.props.departing){
            this.addCoordinate({lat: nextProps.departing.latitude, lng: nextProps.departing.longitude});
        }
        if(this.props.departing && !nextProps.departing){
            this.removeCoordinate({lat: this.props.departing.latitude, lng: this.props.departing.longitude});

        }
        if(nextProps.destination && !this.props.destination){
            this.addCoordinate({lat: nextProps.destination.latitude, lng: nextProps.destination.longitude});
        }
        if(this.props.destination && !nextProps.destination){
            this.removeCoordinate({lat: this.props.destination.latitude, lng: this.props.destination.longitude});

        }
        if(nextProps.departing === nextProps.destination){

        }
    }
    addCoordinate({lat,lng}){
        const coordinate = {
            position: {lat,lng},
            onLoaded: (googleMaps, map, marker) => {

            }
        };
        this.setState({coordinates: [...this.state.coordinates, coordinate]},
            () => {
                const coordinates = this.state.coordinates;
                if(coordinates.length === 2){
                    this.addRoute();
                }
            });
    }
    addRoute(){
        const googleMaps = this.state.googleMaps;
        const map = this.state.map;
        const route = new googleMaps.Polyline({
            path: [
                new googleMaps.LatLng(this.props.departing.latitude, this.props.departing.longitude),
                new googleMaps.LatLng(this.props.destination.latitude, this.props.destination.longitude)
            ],
            geodesic: true,
            strokeColor: muiThemeStyle.palette.textColor,
            map
        });
        this.setState({route});
    }
    removeRoute(){
        this.state.route.setMap(null)
    }
    removeCoordinate({lat,lng}){
        let oldCoordinates = this.state.coordinates;

        const coordinates = this.state.coordinates[0] === this.state.coordinates[1]
            ? [this.state.coordinates[0]]
            : oldCoordinates.filter(coordinate => coordinate.position.lat !== lat && coordinate.position.lng !== lng);

        this.setState({coordinates},
            () => {
                const coordinates = this.state.coordinates;
                if(coordinates.length !== 2){
                    this.removeRoute();
                }

            });
    }
    render(){
        return (
            <div id="map" style={{height: this.props.height, width: this.props.width, paddingBottom: 15, paddingLeft: 15, paddingRight: 15}}>
                <GoogleMap
                    autoFitBounds={true}
                    googleMaps={this.props.googleMaps}
                    coordinates={this.state.coordinates}
                    center={{lat: 40, lng: -97}}
                    zoom={4}
                    onLoaded={(googleMaps, map) => {
                        map.setMapTypeId(googleMaps.MapTypeId.TERRAIN);
                        this.setState({googleMaps, map})
                    }}
                />
            </div>
        );
    }
}

Map.propTypes = {
    googleMaps: PropTypes.object.isRequired,
    departing: PropTypes.object,
    destination: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number
};

export default GoogleMapLoader(Map, {
    libraries: ["places","geometry"],
    key: config.googleMapsAPIkey,
});