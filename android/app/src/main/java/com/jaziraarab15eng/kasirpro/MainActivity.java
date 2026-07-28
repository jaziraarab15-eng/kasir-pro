package com.jaziraarab15eng.kasirpro;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.jaziraarab15eng.kasirpro.plugins.BluetoothPrinterPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        registerPlugin(BluetoothPrinterPlugin.class);
    }

}

