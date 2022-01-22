export default class EventDispatcher{
    static dispatch(event){
        document.querySelector('body').dispatchEvent(event);
    }
}