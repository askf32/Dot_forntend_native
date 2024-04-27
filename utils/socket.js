class WsServices {
    initializeSocket = async ()=>{
  try {
    this.socket = io("http://localhost:3000",{
    autoConnect: true
  })
  console.log("=== Socket Initializing ===", socket);
  this.socket.on = ('connect', (data)=>{
    console.log('===socket connected====', data);
  })
  this.socket.on('disconnect', (data)=>{
    console.log('===socket disconnected===', data);
  })
  this.socket.on('error',(data)=>{
    console.log("<======socket error====>" ,data);
  })
  } catch (error) {
    console.log("socket is not intialized", error);
  }
  }
  emit(event, data = {}){
    this.socket.emit(event, data)   
  }
on(event, cb) {
    this.socket.on(event, cb)
}
removeListener(listenerName){
    this.socket.removeListener(listenerName)
}
  }
const socketServices = new WsServices()

export default socketServices;