#define buttonPin 2
#define lightPin A0
#define potPin A1


void setup() {
  // initialize serial communication
  Serial.begin(9600);

  // setup pins
  pinMode(buttonPin, INPUT);
}

void loop() {
  int buttonVal = digitalRead(buttonPin);
  int lightVal = analogRead(lightPin);
  int potVal = analogRead(potPin);

  Serial.print(buttonVal);
  Serial.print(',');
  Serial.print(lightVal);
  Serial.print(',');
  Serial.print(potVal);
  Serial.println();

  delay(1);
}
