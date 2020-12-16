import React from 'react'
import Axios from 'axios'
import { Button, Image, Modal, Toast } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class DetailProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            total: 0,
            toLogin: false,
            cartErr: false,
            toCart: false
        }
        Axios.get(`http://localhost:2000/products/${this.props.location.search}`)
            .then((res) => {
                // console.log(res.data)
                this.setState({ data: res.data[0] })
            })
    }
    btnbuy = () => {
        const { total, size, data } = this.state
        if (!this.props.id) return this.setState({ toLogin: true })
        // check user input
        if (total === 0 || size === null) return this.setState({ cartErr: true })

        let cartData = {
            id: data.id,
            name: data.name,
            image: data.img,
            price: data.price,
            qty: total,
            totalPrice: total * data.price,
            stock: data.stock
        }
        let Tempcart = this.props.cart
        console.log(Tempcart)
        if (Tempcart.name === cartData.name) return (
            cartData.qty = Tempcart.qty + cartData.qty
            // Tempcart.push(cartData)    
        )
        Tempcart.push(cartData)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
            cart: Tempcart
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ toCart: true })
            })
            .catch((err) => console.log(err))
    }
    render() {
        const { data, total, toLogin, cartErr, toCart } = this.state
        if (toLogin) return <Redirect to='/Login' />
        // if (toCart) return <Redirect to='/CartPage' />
        return (
            <div style={{ padding: '0 20px', backgroundColor: 'rgba(128, 128, 128, 0.2)' }}>
                <h1>{data.name}</h1>
                <div style={{ display: "flex", height: '83vh' }}>
                    <div style={{ display: "flex", flexBasis: '40%' }}>
                        <Image src={data.img} style={{ width: '100%', borderRadius: '30px' }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: 'column', flexBasis: '60%', padding: '50px' }}>
                        <h1>{data.name}</h1>
                        <h3>Description :</h3>
                        <p style={{ fontSize: '20px' }}>{data.description}</p>
                        <h4>Price :</h4>
                        <p style={{ fontSize: '20px' }}> IDR {data.price ? data.price.toLocaleString() : 0}</p>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h5>*Stock = {data.stock}</h5>
                            <div style={{ width: '20%', height: '20px' }}>
                                <h5>Quantity: </h5>
                                <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#ffffff', justifyContent: 'space-between' }}>
                                    <Button
                                        disabled={total <= 0 ? true : false}
                                        onClick={() => this.setState({ total: total - 1 })}
                                        variant="dark"
                                    >-</Button>
                                    <h1>{total}</h1>
                                    <Button
                                        disabled={total >= data.stock ? true : false}
                                        onClick={() => this.setState({ total: total + 1 })}
                                        variant="dark"
                                    >+</Button>
                                </div>
                            </div>
                        </div>
                        <Button variant='dark' style={{ marginTop: '100px' }} onClick={this.btnbuy}>BUY</Button>
                    </div>
                </div>
                <Modal show={cartErr} onhide={() => this.setState({ cartErr: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Please Choose Quantity</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartErr: false })}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    style={{
                        position: 'relative',
                        minHeight: '200px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                        }}
                    >
                        <Toast show={toCart} delay={1000} autohide>
                            <Toast.Header>
                                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                                <strong className="mr-auto">Added To Cart</strong>
                            </Toast.Header>
                            <Toast.Body>Added To Cart See on your Cart</Toast.Body>
                        </Toast>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps)(DetailProduct)