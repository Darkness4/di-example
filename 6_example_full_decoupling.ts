/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Manual Instanciation when needed

import { Observable, Subscription } from 'rxjs';

let instanceCounter = 0;

export class ServiceImpl implements Service {
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

export interface Service {
  serveHelloWorld(): Observable<string>;
  serveJohnDoe(): Observable<string>;
}

export class RepositoryImpl implements Repository {
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

export interface Repository {
  fetchHelloWorld(): Observable<string>;
  fetchJohnDoe(): Observable<string>;
}

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

export class Module {
  private static instance?: Module;

  private constructor() {
    instanceCounter++;
  }

  static getInstance(): Module {
    if (!Module.instance) {
      Module.instance = new Module();
    }
    return Module.instance;
  }

  service = new ServiceImpl();
  repository = new RepositoryImpl(this.service);
}

const module = Module.getInstance();

const clientA = new Client(module.repository);
clientA.onInit();

console.log('1 Client: ' + instanceCounter);

const clientB = new Client(module.repository);
clientB.onInit();

console.log('2 Clients: ' + instanceCounter);

// Ceci est un injection de dépendance avec un conteneur d'instances avec implémentations cachés
