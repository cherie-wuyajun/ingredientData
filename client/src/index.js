import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const HOST_URL = 'http://localhost:3000/ingredient'
//const FUZZY_SEARCH = 'http://localhost:3000/ingredient'

class NameSearch extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeIngredientName = this.onChangeIngredientName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            ingredient:'',
            text:'',
            tags:[]
        };
    }
    onSubmit(e){
        this.setState({
            ingredient: '',
            text:'',
            tags:[]
        });
        e.preventDefault();
        const serverPut={
            name:this.state.ingredient
        };
        console.log(serverPut.name)
        axios.get(HOST_URL+'/'+ serverPut.name)
            .then(response => {
                for (let tag in response.data.tags) {
                    tag=tag.toLowerCase()
                    console.log(this.state.tags)
                    this.state.tags.push(tag)
                    this.state.tags.push(', ')
                };
                this.state.tags.pop()
                this.setState({
                    text: response.data.text,
                });
            })
            .catch(function (error) {
                console.log(error);
                })
    }

    onChangeIngredientName(e) {
        this.setState({
            ingredient: e.target.value
        });
    }
    render() {
        return (
            <div className="container">
            Hello!
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" value={this.state.ingredient} onChange={this.onChangeIngredientName}/>
                    <input type="submit" value="submit" className="btn btn-primary" />
                </div>
            </form>
            <table>
                <tbody>
                    <tr>
                        <td>Texts</td>
                        <td>{this.state.text}</td>
                    </tr>
                    <tr>
                        <td>Tags</td>
                        <td>{this.state.tags}</td>
                    </tr>
                </tbody>
            </table>
            </div>
    );
    }
};

ReactDOM.render(<NameSearch/>,document.getElementById('root'));