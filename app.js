let bluetoothDevice;
let server;
let characteristic;

const connectButton = document.getElementById('connect');
const toggleLedButton = document.getElementById('toggleLed');

async function connectBluetooth() {
  try {
    console.log('Requesting Bluetooth Device...');
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'HC' }], // Adjust to your Bluetooth module's name prefix
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
    });

    console.log('Connecting to GATT Server...');
    server = await bluetoothDevice.gatt.connect();

    console.log('Getting Primary Service...');
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');

    console.log('Getting Characteristic...');
    characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

    console.log('Bluetooth connected!');
  } catch (error) {
    console.error('Bluetooth connection failed!', error);
  }
}

async function toggleLed() {
  if (characteristic) {
    try {
      await characteristic.writeValue(Uint8Array.of(49)); // 49 is ASCII code for '1'
      await new Promise((resolve) => setTimeout(resolve, 500));
      await characteristic.writeValue(Uint8Array.of(48)); // 48 is ASCII code for '0'
      console.log('LED toggled!');
    } catch (error) {
      console.error('Error toggling LED:', error);
    }
  } else {
    console.warn('No Bluetooth device connected!');
  }
}

connectButton.addEventListener('click', connectBluetooth);
toggleLedButton.addEventListener('click', toggleLed);
