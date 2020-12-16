import React from 'react'
import {
    Nav,
    Navbar,
    Dropdown,
    Button
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {logout} from '../action'

class Navigation extends React.Component {
    btnLogout = () => {
        this.props.logout()
        localStorage.removeItem('email')
    }
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to='/'>Toko Nih</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/'>Home</Nav.Link>
                    </Nav>
                    <Button variant="outline-dark" as={Link} to='/CartPage'>Cart</Button>
                    <Dropdown style={{ marginRight: '50px' }}>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            {this.props.email ? this.props.email : 'Log In'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.email
                                ?
                                <Dropdown.Item>
                                    <Dropdown.Item onClick={this.btnLogout}>Log Out</Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/History'>History</Dropdown.Item>
                                </Dropdown.Item>
                                :
                                <Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/Login'>Login</Dropdown.Item>
                                </Dropdown.Item>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}

export default connect(mapStateToProps, {logout}) (Navigation)