# pi-ir
Raspberry pi infra red controller

## Learn More

### Server

#### Installing Lirc

1. Install
```
$ sudo apt-get update
$ sudo apt-get install lirc
```

2. Update /boot/config.txt

Edit /boot/config.txt

`dtoverlay=gpio-ir-tx, gpio_pin=17`

3. Update /etc/modules:

```
lirc_dev
lirc_rpi gpio_in_pin=18 gpio_out_pin=17
```

4. Rename default remote config

`mv devinput.lircd.conf devinput.lircd.conf.dist`

####  Lirc trouble shooting
- if you get the “irsend: fill_string: timeout”. Try removing any “repeat” properties from the remote config e.g. lircd.conf.d/tel.conf 

```
#  repeat       9089  2133
#  min_repeat      2
```

See: https://lirc-list.narkive.com/X4zafF1X/irsend-fill-string-timeout

#### Useful Commands

`tail  /var/log/messages -f`

#### Deploy server

1. Tar server up on Mac:
```
tar --exclude='./node_modules/' -zcvf pi-ir.tgz ./server 
```

2. Copy to Pi:
```
scp pi-ir.tgz pi@192.168.1.51:~  
scp client.tgz pi@192.168.1.51:~/pi-ir/server/public 
```

3. Un -Tar on Pi:

`tar xvzf pi-ir.tgz`

#### Deploy Client

1. Tar Client - on Mac
```
npm run build
cd /out run: tar --exclude='./node_modules/' -zcvf client.tgz .
scp client.tgz pi@192.168.1.51:~/pi-ir/server/public 
```

2. On Pi
```
~/pi-ir/server/public $ sudo rm -rf *
~/pi-ir/server/public $ tar xvzf client.tgz ./
```
- todo: ^ script the above

#### Lirc service cmds:
```
 sudo systemctl status lircd.service
 sudo systemctl restart lircd.service
```

#### PM2 - run node as a service
```
sudo npm install -g pm2
~ pm2 start pi-ir/server/bin/www
```
```
pm2 startup systemd - copy and run cmd
pm2 save
```
- To restart pm2 process
`pm2 restart www`

#### Other links:
https://github.com/AnaviTechnology/anavi-docs/blob/main/anavi-infrared-phat/anavi-infrared-phat.md#setting-up-lirc
https://github.com/AnaviTechnology/anavi-docs/issues/21
