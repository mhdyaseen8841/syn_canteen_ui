import {
  Printer,
  Text,
  Line,
  Row,
  render
} from 'react-thermal-printer';

const MyReceipt = () => {
  const printerData = render(
    <Printer>
      <Text align="center" bold={true}>My Company</Text>
      <Line />
      <Row left="Item" right="$10.00" />
      <Row left="Total" right="$10.00" />
    </Printer>
  );

  const handlePrint = async () => {
    await fetch('http://192.168.1.20:3001/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: printerData })
    });
  };

  return <button onClick={handlePrint}>Print</button>;
};
