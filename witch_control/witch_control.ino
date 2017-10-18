#define buttonPin 2
#define lightPin A0
#define potPin A1

int minLightValue = 1023;
int maxLightValue = 0;

void setup() {
  // initialize serial communication
  Serial.begin(9600);

  // setup pins
  pinMode(buttonPin, INPUT);
}

void loop() {
  // read values
  int buttonVal = digitalRead(buttonPin);
  int lightVal = analogRead(lightPin);
  int potVal = analogRead(potPin);

  // calibrate light sensor
  if(lightVal < minLightValue) minLightValue = lightVal;
  if(lightVal > maxLightValue) maxLightValue = lightVal;
  lightVal = map(lightVal, minLightValue, maxLightValue, 0, 100);

  // send data
  Serial.print(buttonVal);
  Serial.print(',');
  Serial.print(lightVal);
  Serial.print(',');
  Serial.print(potVal);
  Serial.println();
}
