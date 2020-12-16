import Axios from 'axios'
import React from 'react'
import { 
    Card,
    Button
} from 'react-bootstrap'
import {Link} from 'react-router-dom'

class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        Axios.get('http://localhost:2000/products')
            .then((res) => {
                this.setState({ data: res.data })
            })
    }
    Buybtn = (index) => {
        return <h1>hola{index}</h1>
    }
    render() {
        console.log(this.state.data)
        return (
            <div style={{display:'flex', padding: '50px', flexWrap: "wrap", justifyContent: 'space-around', backgroundColor: 'grey', height:'100vh'}}>
                {this.state.data.map((item, index) => {
                    return (
                        <Card style={{ width: '18rem', margin: '5px 30px', borderRadius:'30px', height:'50vh' }} key={index}>
                            <Card.Img variant="top" src={item.img} style={{borderRadius:'30px'}} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    Price : IDR {item.price ? item.price.toLocaleString() : 0}
                                </Card.Text>
                                <Button variant="primary" style={{marginRight: '5px'}}>Wish list</Button>
                                <Button variant="dark" as={Link} to={`/Detail?id=${item.id}`}>Buy Now</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default Product 