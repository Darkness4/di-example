/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Decoupling the objects

import { Observable, Subscription } from 'rxjs';

let instanceCounter = 0;

/// service.ts
export class Service {
  private static instance?: Service;

  private constructor() {
    instanceCounter++;
  }

  static getInstance(): Service {
    if (!Service.instance) {
      Service.instance = new Service();
    }
    return Service.instance;
  }

  serveHelloWorld(): Observable<string> {
    return new Observable((observer) => {
      observer.next('Hello');
      observer.next('World');
      observer.complete();
    });
  }

  serveJohnDoe(): Observable<string> {
    return new Observable((observer) => {
      observer.next('John');
      observer.next('Doe');
      observer.complete();
    });
  }
}

/// repository.ts
export class Repository {
  constructor(private readonly service: Service) {
    instanceCounter++;
  }

  fetchHelloWorld(): Observable<string> {
    return this.service.serveHelloWorld();
  }

  fetchJohnDoe(): Observable<string> {
    return this.service.serveJohnDoe();
  }
}

/// client.ts
export class Client {
  constructor(private readonly repository: Repository) {
    instanceCounter++;
  }

  subscriptionHelloWorld?: Subscription;
  subscriptionJohnDoe?: Subscription;

  onInit(): void {
    /* User code */
    this.showHelloWorld();
    this.showJohnDoe();

    /* END of User code */
    this.onDestroy();
  }

  showHelloWorld(): void {
    this.subscriptionHelloWorld?.unsubscribe();
    this.subscriptionHelloWorld = this.repository
      .fetchHelloWorld()
      .subscribe((data) => console.log(data));
  }

  showJohnDoe(): void {
    this.subscriptionJohnDoe?.unsubscribe();
    this.subscriptionJohnDoe = this.repository
      .fetchJohnDoe()
      .subscribe((data) => console.log(data));
  }

  onDestroy(): void {
    this.subscriptionHelloWorld?.unsubscribe();
    this.subscriptionJohnDoe?.unsubscribe();
    console.log('DESTROYED');
  }
}

/// main.ts
const service = Service.getInstance();
const repository = new Repository(service);
const clientA = new Client(repository);
clientA.onInit();

console.log('1 Client: ' + instanceCounter);

const clientB = new Client(repository);
clientB.onInit();

console.log('2 Clients: ' + instanceCounter);

// Ceci est un injection de dépendance de base
