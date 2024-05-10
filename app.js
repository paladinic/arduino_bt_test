let bluetoothDevice;
let server;
let characteristic;

const connectButton = document.getElementById('connect');
const toggleLedButton = document.getElementById('toggleLed');

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'HC-05' }], // Adjust to your Bluetooth device's name
      optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']
    });
    server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
    characteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');

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
