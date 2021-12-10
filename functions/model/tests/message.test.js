
const Message = require('../message.js')

beforeEach(() => {
    msg = new Message;
});

test('Constructs object', () => {
    expect.any(msg);

})

test('Sets subject', () => {
    msg.setSubject("test Subject");
    expect(msg.subject).toBe("test Subject");
})

test('Sets TimeStamp', () => {
    msg.setTimeStamp("1/1/2021");
    expect(msg.timeStamp).toBe("1/1/2021");
})

test('Sets Composer', () => {
    msg.setComposer("bob@bob.com");
    expect(msg.composer).toBe("bob@bob.com");
})

test('Sets Recepient', () => {
    msg.setRecepient("mary@mary.com");
    expect(msg.recepient).toBe("mary@mary.com");
})

test('Sets Elements', () => {
    msg.setElements("<dur='1s'/>");
    expect(msg.elements).toBe("<dur='1s'/>");
})

test('Sets State', () => {
    msg.setState("draft");
    expect(msg.state).toBe("draft");
})

test('Sets SmilMessage', () => {
    msg.setSmilMessage("<smil><smilText dur='1s' start='1s'>Test</smil>");
    expect(msg.smilMessage).toBe("<smil><smilText dur='1s' start='1s'>Test</smil>");
})

test('Sets ID', () => {
    msg.setId("x45939fghd");
    expect(msg.id).toBe("x45939fghd");
})

test('Gets timestamp', () => {
    expect.anything(msg.getTimestampString);
})
