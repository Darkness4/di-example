/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Manual Instanciation when needed

import { Observable, Subscription } from 'rxjs';

let instanceCounter = 0;

export class Service {
  constructor() {
    instanceCounter++;
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

export class Repository {
  private readonly service = new Service();

  constructor() {
    instanceCounter++;
  }

  fetchHelloWorld(): Observable<string> {
    return this.service.serveHelloWorld();
  }

  fetchJohnDoe(): Observable<string> {
    return this.service.serveJohnDoe();
  }
}

export class Client {
  private readonly repository = new Repository();

  constructor() {
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

const clientA = new Client();
clientA.onInit();

console.log('1 Client: ' + instanceCounter);

const clientB = new Client();
clientB.onInit();

console.log('2 Clients: ' + instanceCounter);

/// PB: Toujours trop d'instances
/// 1 dépendance/instance
