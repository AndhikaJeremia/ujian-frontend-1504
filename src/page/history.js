import Axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { getHistory } from '../action'
import { Accordion, Card, Table, Image, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

class HistoryPage extends React.Component {
    componentDidMount() {
        Axios.get(`http://localhost:2000/history?username=${localStorage.email}`)
            .then((res) => this.props.getHistory(res.data))
    }
    showAccordion = () => {
        let history = this.props.history.reverse()
        return (
            <Accordion defaultActiveKey="0" style={{borderRadius:'15px'}}>
                {history.map((item, index) => {
                    return (
                        <Card style={{borderRadius:'15px', marginBottom:'5px'}}>
                            <Card.Header style={{backgroundColor:'grey', borderRadius:'15px'}}>
                                <Accordion.Toggle as={Card.Header} eventKey={index.toLocaleString()} style={{backgroundColor: 'black', color:'white', borderRadius:'15px'}}>
                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                        <h5>Date: {item.date}</h5>
                                        <h5>Total : IDR {item.total.toLocaleString()}</h5>
                                    </div>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={index.toLocaleString()}>
                                <Card.Body>
                                    <Table variant='dark' bordered hover borderless style={{ borderRadius: '15px' }} >
                                        {this.showTablehead()}
                                        {this.showTablebody(index)}
                                    </Table>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                    )
                })}
            </Accordion>
        )
    }
    showTablehead = () => {
        return (
            <thead>
                <th>No</th>
                <th>Images</th>
                <th>Product Name</th>
                <th>qty</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
            </thead>
        )
    }
    showTablebody = (index) => {
        let history = this.props.history
        return (
            <tbody>
                    {history[index].product.map((item, idx) => { 
                        return(
                           <tr>
                               <td>{idx + 1}</td>
                               <td>
                               <Image src={item.image} style={{ height: '100px', width: '100px', borderRadius: '5px' }} />
                               </td>
                               <td>{item.name}</td>
                               <td>{item.qty}</td>
                               <td>IDR {item.totalPrice.toLocaleString()}</td>
                               <td>{item.status}</td>
                               <Button variant='danger' onClick={() => this.btncancel(index)}>Cancel</Button>
                           </tr> 
                        )
                    })}
            </tbody>
        )
    }
    btncancel = (index) => {
        
    }
    render() {
        if (!localStorage.email) return <Redirect to='/login'/>
        return (
            <div style={{ padding: '40px' }}>
                <h1>Last Order</h1>
                {this.showAccordion()}

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        history: state.history
    }
}

export default connect(mapStateToProps, { getHistory })(HistoryPage)