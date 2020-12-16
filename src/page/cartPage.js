import Axios from 'axios'
import React from 'react'
import { Button, Form, Image, Table, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../action'

class CartPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            selectedindex: null,
            newQty: 0,
            reqcheckout: false,
            toHistory: false
        }
        Axios.get(`http://localhost:2000/products`)
            .then((res) => this.setState({ products: res.data }))
            .catch((err) => console.log(err))
    }
    ShowTbleHead = () => {
        let Cart = this.props.cart
        if (Cart.length === 0) return (
            <div style={styles.ortable}></div>
        )
        return (
            <thead>
                <th>No</th>
                <th>Images</th>
                <th>Product Name</th>
                <th>qty</th>
                <th>Total</th>
                <th>Action</th>
            </thead>
        )
    }
    ShowTbleBody = () => {
        console.log(this.state.newQty)
        let Cart = this.props.cart
        if (Cart.length === 0) return (
            <h3 style={styles.ortable}>Your Cart is Empty Click button below to shop :</h3>
        )
        return (

            <tbody>
                {Cart.map((item, index) => {
                    if (this.state.selectedindex === index) return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Image src={item.image} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                            </td>
                            <td>{item.name}</td>
                            <td style={{ display: 'flex' }}>
                                <Button onClick={() => this.minbtn(index)}>➖</Button>
                                <Form.Control style={{ width: '80px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} />
                                <Button onClick={() => this.setState({ newQty: parseInt(this.state.newQty) + 1 })} disabled={this.state.newQty >= item.stock}>➕</Button>
                            </td>
                            <td>Rp.{item.totalPrice.toLocaleString()} </td>
                            <td style={{ display: "flex" }}>
                                <Button variant='light' style={{ marginRight: '10px' }} onClick={() => this.setState({ selectedindex: null })}>Cancel</Button>
                                <Button variant='light' onClick={() => this.btnsave(index)}>Save</Button>
                            </td>

                        </tr>
                    )
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Image src={item.image} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>Rp.{item.totalPrice.toLocaleString()}</td>
                            <td style={{ display: "flex" }}>
                                <Button variant='light' style={{ marginRight: '10px' }} onClick={() => this.btndel(index)}>❌</Button>
                                <Button variant='light' onClick={() => this.setState({ selectedindex: index, newQty: item.qty })}>Edit</Button>
                            </td>

                        </tr>
                    )

                })}
            </tbody>
        )
    }
    btnsave = (index) => {
        if (this.state.newQty === 0) return (this.btndel(index))
        let tempProduct = this.props.cart[index]
        tempProduct.qty = parseInt(this.state.newQty)
        tempProduct.totalPrice = this.state.newQty * this.props.cart[index].price
        console.log(tempProduct)
        let tempCart = this.props.cart
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                // update data di redux
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedindex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    minbtn = (index) => {
        if (this.state.newQty <= 0) return (this.btndel(index))

        this.setState({ newQty: this.state.newQty - 1 })
    }
    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }
    btndel = (index) => {
        let tempCart = this.props.cart
        tempCart.splice(index, 1)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
            cart: tempCart
        })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => this.props.login(res.data))
            })
    }
    btndelAll = () => {
        let tempCart = this.props.cart
        tempCart.splice(0)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
            cart: tempCart
        })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => this.props.login(res.data))
            })
    }
    checkout = () => {
        this.setState({ reqcheckout: true })
    }
    fnTotalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.totalPrice)
        return counter
    }
    confCheckout = () => {
        let total = this.fnTotalPrice()
        let tempCart = this.props.cart
        let tempProduct = this.state.products

        let newstock = []
        tempProduct.map((item) => {
            if (item.id === tempCart.id) return (
                newstock.push(item.stock - tempCart.qty)
            )
        })

        for (let update of newstock) {
            Axios.patch(`http://localhost:2000/products/${update.id}`, { stock: newstock })
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => console.log(err))

        }

        let history = {
            email: this.props.email,
            date: new Date().toLocaleString(),
            total: total,
            product: tempCart,
            status: "Waiting Payment"
        }
        console.log(history)
        // update data history user
        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)

                // kosongkan cart dan update database
                Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)

                        // update redux
                        Axios.get(`http://localhost:2000/users/${this.props.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ reqchekout: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    showModal = () => {
        const { reqcheckout } = this.state
        return (
            <div>

                <Modal show={reqcheckout} onHide={() => this.setState({ reqcheckout: false })}>
                    <Modal.Header closeButton={() => this.setState({ reqcheckout: false })}>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Are you Sure want to Checkout</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqcheckout: false })}>
                            Close
                </Button>
                        <Button variant="primary" onClick={this.confCheckout} >
                            Confirm
                </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    render() {
        const { toHistory } = this.state
        let TempCart = this.props.cart
        if (!localStorage.email) return <Redirect to='/Login' />
        if (toHistory) return <Redirect to='/History' />
        if (TempCart.length >= 4)
            return (
                <div style={styles.backgroundcontainer}>
                    <div style={styles.container}>
                        <h1 style={styles.body}>On Your Cart</h1>
                        <Table variant='dark' bordered hover borderless style={{ borderRadius: '15px' }} >
                            {this.ShowTbleHead()}
                            {this.ShowTbleBody()}
                        </Table>
                        <Button as={Link} to='/' style={{ marginRight: '10px' }} variant='dark'>Shop</Button>
                        <Button onClick={this.btndelAll} disabled={(TempCart.length === 0)} variant='dark' style={{ marginRight: '10px' }}>Delete All Cart</Button>
                        <div style={styles.body2}>
                            <h1>Total Price: IDR {this.fnTotalPrice().toLocaleString()}</h1>
                            <Button onClick={this.checkout} disabled={(TempCart.length === 0)} variant='danger' style={{ padding: '10px' }}>Checkout</Button>
                        </div>
                    </div>
                    {this.showModal()}
                </div>
            )
        return (
            <div style={styles.backgroundcontainer2}>
                <div style={styles.container}>
                    <h1 style={styles.body}>On Your Cart</h1>
                    <Table variant='dark' bordered hover borderless style={{ borderRadius: '15px' }} >
                        {this.ShowTbleHead()}
                        {this.ShowTbleBody()}
                    </Table>
                    <Button as={Link} to='/' style={{ marginRight: '10px' }} variant='dark'>Shop</Button>
                    <Button onClick={this.btndelAll} disabled={(TempCart.length === 0)} variant='dark' style={{ marginRight: '10px' }}>Delete All Cart</Button>
                    <div style={styles.body2}>
                        <h1>Total Price: IDR {this.fnTotalPrice().toLocaleString()}</h1>
                        <Button onClick={this.checkout} disabled={(TempCart.length === 0)} variant='danger' style={{ padding: '10px' }}>Checkout</Button>
                    </div>
                </div>
                {this.showModal()}
            </div>
        )
    }
}
const styles = {
    backgroundcontainer: {
        background: 'url(https://images.unsplash.com/photo-1565379793984-e65b51b33b37?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80) no-repeat center',
        height: 'auto',
        width: '100wh',
        backgroundSize: 'cover',
        display: 'flex',
    },
    backgroundcontainer2: {
        background: 'url(https://images.unsplash.com/photo-1565379793984-e65b51b33b37?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80) no-repeat center',
        height: '115vh',
        width: '100wh',
        backgroundSize: 'cover',
        display: 'flex',
    },
    container: {
        margin: '100px auto',
        width: '1000px',
        height: 'auto',
        backgroundColor: 'rgba(149, 165, 166,0.5)',
        color: 'rgba(47, 53, 66,1.0)',
        padding: '15px',
        borderRadius: '15px'
    },
    body: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        textAlign: 'center',
    },
    body2: {
        backgroundColor: 'rgba(75, 75, 75, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    },
    ortable: {
        textAlign: 'center'
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart,
        pass: state.user.password,
        email: state.user.email
    }
}

export default connect(mapStateToProps, { login })(CartPage)