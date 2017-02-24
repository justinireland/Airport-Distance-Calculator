import React, { Component } from 'react';
import {Card, CardMedia, CardText } from 'material-ui/Card';
// Custom components
import Input from './components/input';
import Map from './components/map';
// Other
import airports from './data/airports.json';
import {styles} from './styles';

class App extends Component {
    constructor(props){
        super(props);

        let airportList = airports.map(airport => airport.iata !== '' ? `(${airport.iata}) ${airport.name}` : airport.name);

        this.state = {
            airportList,
            airportDeparting: {
                name: '',
                index: -1,
                latitude: null,
                longitude: null
            },
            airportDestination: {
                name: '',
                index: -1,
                latitude: null,
                longitude: null
            },
            height: window.innerHeight,
            width: window.innerWidth,
            distance: 0
        }
    }
    componentDidMount(){window.addEventListener("resize", () => this.updateDimensions());}
    componentWillMount() {
        document.body.style.backgroundColor = '#999';
        this.updateDimensions()
    }
    componentWillUnmount() {
        document.body.style.backgroundColor = null;
        window.removeEventListener("resize", () => this.updateDimensions());
    }
    updateAirportDeparting(text){
        this.setState({airportDeparting: {name: text}});

        const index = this.state.airportList.indexOf(text);

        if(index >= 0){
            const latitude = parseFloat(airports[index].latitude);
            const longitude = parseFloat(airports[index].longitude);
            this.setState({airportDeparting: {index,latitude,longitude}});

            if(this.state.airportDestination.index >= 0){
                this.updateDistance(latitude,longitude,this.state.airportDestination.latitude,this.state.airportDestination.longitude);
            }
        } else {
            this.setState({airportDeparting: {index: -1, latitude: null, longitude: null}});
        }
    }
    updateAirportDestination(text){
        this.setState({airportDestination: {name: text}});

        const index = this.state.airportList.indexOf(text);

        if(index >= 0){
            const latitude = parseFloat(airports[index].latitude);
            const longitude = parseFloat(airports[index].longitude);
            this.setState({airportDestination: {index,latitude,longitude}});

            if(this.state.airportDeparting.index >= 0){
                this.updateDistance(this.state.airportDeparting.latitude,this.state.airportDeparting.longitude,latitude,longitude);
            }
        } else {
            this.setState({airportDestination: {index: -1, latitude: null, longitude: null}});
        }
    }
    updateDimensions = () => {
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.setState({height, width});
    }
    updateDistance(lat1,lon1,lat2,lon2){

        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;
        const theta = lon1-lon2;
        const radtheta = Math.PI * theta/180;
        let distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        distance = Math.acos(distance);
        distance = distance * 180/Math.PI;
        distance = distance * 60 * 1.1515;
        distance = Math.round(distance * 0.8684) || 0;

        this.setState({distance});
    }
    render() {

        const resultText = this.state.airportDeparting.index >= 0 && this.state.airportDestination.index >= 0
            ?   <span>
                    <span style={styles.highlightText}>{this.state.distance}</span>
                    <span style={styles.normalText}>nautical miles</span>
                </span>
            : null;

        return (
            <div>
                <Card style={{maxWidth: 780, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <CardText>
                        <div style={{margin: 'auto'}}>
                            <Input
                                dataSource={this.state.airportList}
                                placeholder="Departing Airport"
                                handleUpdateInput={searchText => this.updateAirportDeparting(searchText)}
                                searchText={this.state.airportDeparting.name} />
                            <Input
                                fillWidth={true}
                                dataSource={this.state.airportList}
                                placeholder="Destination Airport"
                                handleUpdateInput={searchText => this.updateAirportDestination(searchText)}
                                searchText={this.state.airportDestination.name} />
                        </div>
                        <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'center',width: '100%',margin: 'auto',marginTop: 15}}>
                            {resultText}
                        </div>
                    </CardText>
                    <CardMedia>
                        <Map height={this.state.height - 250}
                             departing={this.state.airportDeparting.latitude && this.state.airportDeparting.longitude
                                 ? { latitude: this.state.airportDeparting.latitude, longitude: this.state.airportDeparting.longitude }
                                 : null}
                             destination={this.state.airportDestination.latitude && this.state.airportDestination.longitude
                                 ? { latitude: this.state.airportDestination.latitude, longitude: this.state.airportDestination.longitude }
                                 : null}
                        />
                    </CardMedia>
                </Card>
            </div>
        );
    };
}

export default App;
