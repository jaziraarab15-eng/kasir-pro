package com.jaziraarab15eng.kasirpro.plugins;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import java.io.OutputStream;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@CapacitorPlugin(name = "BluetoothPrinter")
public class BluetoothPrinterPlugin extends Plugin {

    private BluetoothSocket socket;
    private OutputStream outputStream;

    private static final UUID UUID_PRINTER =
        UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    @PluginMethod
    public void connect(PluginCall call) {

        String namaPrinter = call.getString("printer");

        BluetoothAdapter adapter =
                BluetoothAdapter.getDefaultAdapter();

        if(adapter == null){
            call.reject("Bluetooth tidak tersedia");
            return;
        }

        if(!adapter.isEnabled()){
            call.reject("Bluetooth belum aktif");
            return;
        }


        Set<BluetoothDevice> devices =
                adapter.getBondedDevices();


        BluetoothDevice printer = null;


        for(BluetoothDevice device : devices){

            if(device.getName().equals(namaPrinter)){

                printer = device;
                break;

            }

        }


        if(printer == null){

            call.reject("Printer tidak ditemukan");

            return;

        }


        try {

            socket = printer.createRfcommSocketToServiceRecord(
                    UUID_PRINTER
            );


            socket.connect();


            outputStream =
                    socket.getOutputStream();


            JSObject result = new JSObject();

            result.put(
                "status",
                "terhubung"
            );


            call.resolve(result);


        } catch(Exception e){

            call.reject(
                "Gagal konek printer: "
                + e.getMessage()
            );

        }

    }


    @PluginMethod
    public void print(PluginCall call) {

        String text = call.getString("text");

        if(outputStream == null){
            call.reject("Printer belum terhubung");
            return;
        }

        try{

            outputStream.write(text.getBytes("UTF-8"));
            outputStream.write("\n\n\n".getBytes());

            outputStream.flush();

            JSObject result = new JSObject();
            result.put("status","berhasil");
            call.resolve(result);

        }catch(Exception e){

            call.reject(
                "Gagal mencetak: " + e.getMessage()
            );

        }

    }
}

@PluginMethod
public void listPrinters(PluginCall call) {

    BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();

    if (adapter == null) {
        call.reject("Bluetooth tidak tersedia");
        return;
    }

    Set<BluetoothDevice> devices = adapter.getBondedDevices();

    JSObject result = new JSObject();

    StringBuilder daftar = new StringBuilder();

    for (BluetoothDevice device : devices) {
        daftar.append(device.getName()).append("\n");
    }

    result.put("printers", daftar.toString());

    call.resolve(result);
}
