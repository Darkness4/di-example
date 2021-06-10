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
  constructor() {
    instanceCounter++;
  }

  fetchHelloWorld(): Observable<string> {
    const service = new Service();

    return service.serveHelloWorld();
  }

  fetchJohnDoe(): Observable<string> {
    const service = new Service();

    return service.serveJohnDoe();
  }
}

export class Client {
  subscriptionHelloWorld?: Subscription;
  subscriptionJohnDoe?: Subscription;

  constructor() {
    instanceCounter++;
  }

  onInit(): void {
    /* User code */
    this.showHelloWorld();
    this.showJohnDoe();

    /* END of User code */
    this.onDestroy();
  }

  showHelloWorld(): void {
    const repository = new Repository();

    this.subscriptionHelloWorld?.unsubscribe();
    this.subscriptionHelloWorld = repository
      .fetchHelloWorld()
      .subscribe((data) => console.log(data));
  }

  showJohnDoe(): void {
    const repository = new Repository();

    this.subscriptionJohnDoe?.unsubscribe();
    this.subscriptionJohnDoe = repository.fetchJohnDoe().subscribe((data) => console.log(data));
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

/// PB: Trop d'instances générées
/// 1 instance/méthode
