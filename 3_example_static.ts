/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Grouping the instances

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
  private static instance?: Repository;
  private readonly service = Service.getInstance();

  private constructor() {
    instanceCounter++;
  }

  static getInstance(): Repository {
    if (!Repository.instance) {
      Repository.instance = new Repository();
    }
    return Repository.instance;
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
  private readonly repository = Repository.getInstance();

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

/// main.ts
const clientA = new Client();
clientA.onInit();

console.log('1 Client: ' + instanceCounter);

const clientB = new Client();
clientB.onInit();

console.log('2 Clients: ' + instanceCounter);

/// PB: Testabilité
///
/// Je veux customiser le type d'instance: e.g: Au lieu de faire new Client(Repository),
/// je veux faire new Client(FakeRepository)
