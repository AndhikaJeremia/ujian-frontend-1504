import React from 'react'
import {
    Form,
    Button,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap'
import {
    Redirect
} from 'react-router-dom'
import Axios from 'axios'
import {
    login
} from '../action'
import { connect } from 'react-redux'

const URL = 'http://localhost:2000/users'
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            login_users: [],
            emailValidErr: [false, ""],
            passValidErr: [false, ""],
            visible: false,
            loginError: [false, ""]
        }
    }

    btnLogin = () => {
        const { emailValidErr, passValidErr } = this.state
        let email = this.refs.email.value
        let password = this.refs.password.value

        if (!email || !password) return this.setState({ loginError: [true, "Input All Form"] })
        if (emailValidErr[0] || passValidErr[0]) return this.setState({ loginError: [true, "Make sure there is no error in validation"] })
        Axios.get(`${URL}?email=${email}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) return (
                    Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
                        .then((res) => {
                            console.log(res.data)
                            if (res.data.length === 0) return alert('invalid Username or Password')
                            this.props.login(res.data[0])
                            localStorage.setItem('email', email)
                        })
                )

                Axios.post('http://localhost:2000/users', {
                    password: password,
                    role: "user",
                    email: email,
                    cart: []
                }).then((res) => {
                    Axios.get(`http://localhost:2000/users?username=${email}&password=${password}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.length === 0) return alert('invalid Username or Password')
                        this.props.login(res.data[0])
                        localStorage.setItem('email', email)
                    })
                })
            })
        
    }
    emailValid = (e) => {
        let email = e.target.value
        // console.log(email)
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) return this.setState({ emailValidErr: [true, "*Email not valid"] })

        this.setState({ emailValidErr: [false, ""] })
    }
    passValid = (e) => {
        let pass = e.target.value
        let numb = /[0-9]/

        if (!numb.test(pass) || pass.length < 6) return this.setState({ passValidErr: [true, "*Must include symbol, number, min 6 char"] })

        this.setState({ passValidErr: [false, ""] })
    }


    render() {
        if (this.props.email) return <Redirect to='/' />
        const { emailValidErr, passValidErr, visible, loginError } = this.state
        return (
            <div style={styles.backgroundcontainer} >
                <div style={styles.container}>
                    <h1>Login Page</h1>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                <i className="fas fa-envelope" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            style={{ height: "45px" }}
                            ref="email"
                            onChange={(e) => this.emailValid(e)}
                        />
                    </InputGroup>
                    <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '20px' }}>
                        {emailValidErr[1]}
                    </Form.Text>
                    <InputGroup>
                        <InputGroup.Prepend style={{ cursor: 'pointer' }}
                            onClick={() => this.setState({ visible: !visible })}>
                            <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                <i className={visible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            style={{ height: "45px" }}
                            type={visible ? "text" : "password"}
                            ref="password"
                            onChange={(e) => this.passValid(e)}
                        />
                    </InputGroup>
                    <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '20px' }}>
                        {passValidErr[1]}
                    </Form.Text>
                    <Button onClick={this.btnLogin}>Login</Button>
                </div>
                <Modal show={loginError[0]} onHide={() => this.setState({ loginError: [false, ""] })}>
                    <Modal.Header>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{loginError[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ loginError: [false, ""] })}>
                            Okay
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
const styles = {
    backgroundcontainer: {
        background: 'url(https://images.unsplash.com/photo-1578269174279-27814d45033f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80) no-repeat center',
        height: '100vh',
        width: '100wh',
        backgroundSize: 'cover',
        display: 'flex'
    },
    container: {
        margin: '100px auto',
        width: '600px',
        height: '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.815)',
        color: 'white',
        padding: '15px',
        borderRadius: '15px'
    },
    item: {
        margin: '15px 0'
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}

export default connect(mapStateToProps, { login })(Login)