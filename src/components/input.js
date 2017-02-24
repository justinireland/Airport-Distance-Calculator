import React, { PropTypes } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import {muiThemeStyle} from '../styles'

const Input = ({dataSource, handleNewRequest, handleUpdateInput, placeholder, searchText})=> {

    return (
        <div className="input" style={{display: 'inline-block',margin: 'auto',marginLeft: 10,marginRight: 10,maxWidth: 350,minWidth: 350}}>
            <AutoComplete
                floatingLabelText={placeholder}
                filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                fullWidth={true}
                dataSource={dataSource}
                maxSearchResults={5}
                onNewRequest={handleNewRequest}
                onUpdateInput={handleUpdateInput}
                openOnFocus={false}
                searchText={searchText}
                menuProps={{
                    menuItemStyle:{
                        color: muiThemeStyle.palette.textColor,
                        fontSize: 12
                    }
                }}
                textFieldStyle={{fontSize:13}}
            />
        </div>
    );
};

Input.propTypes = {
    dataSource: PropTypes.array.isRequired,
    handleNewRequest: PropTypes.func,
    handleUpdateInput: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    searchText: PropTypes.string
};

export default Input;