
import './App.css';
//import web3 from './web3';
import lottery from './lottery';
import { Component } from 'react';
import web3 from './web3';


class App extends Component  {
  //ES 216 standard
  state={
    manager :"",
    players :[],
    balance :"",
    value :"",
    message :""
  }

  // constructor(props){
  //   super(props)

  //   this.state={manager:''}
  // }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getplayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({manager, players, balance});

  }

  onSubmit= async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts()

    this.setState({message:'Waiting on Transaction Success....'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value:web3.utils.toWei(this.state.value,'ether')
    })

    this.setState({message:'You have been enterded..'})

  }

  onClick = async()=>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Waiting on Transaction Success....'})

    await lottery.methods.PickWinner().send({
      from: accounts[0]
    })
    this.setState({message:'A Winner has been picked!'})
  }
  //console.log(web3.version);
  //web3.eth.getAccounts().then(console.log)
  render(){
  return (
  
    <div>

      <h2>Lottery Contract</h2>
    

      <p>
        This Contract is managed by {this.state.manager}.
        There are currently {this.state.players.length} people entered,
        competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether!.
      </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({value:event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
      
      <hr />
      <h4>Ready to Pick a Winner!</h4>
      <button onClick={this.onClick}>Pick a Winner</button>
      <hr />
      <h1>{this.state.message}</h1>
    </div>
  );
  }
}


export default App;