/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Manual Instanciation when needed

import { Observable, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

export class ServiceImpl implements Service {
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

export class MockService implements Service {
  serveHelloWorld(): Observable<string> {
    return new Observable((observer) => {
      observer.next('Fake Data');
      observer.complete();
    });
  }

  serveJohnDoe(): Observable<string> {
    return new Observable((observer) => {
      observer.next('Fake Data');
      observer.complete();
    });
  }
}

export interface Service {
  serveHelloWorld(): Observable<string>;
  serveJohnDoe(): Observable<string>;
}

export class RepositoryImpl implements Repository {
  constructor(private readonly service: Service) {}

  fetchHelloWorld(): Observable<string> {
    return this.service.serveHelloWorld();
  }

  fetchJohnDoe(): Observable<string> {
    return this.service.serveJohnDoe();
  }
}

export class MockRepository implements Repository {
  fetchHelloWorld(): Observable<string> {
    return new Observable((observer) => {
      observer.next('Fake Data');
      observer.complete();
    });
  }

  fetchJohnDoe(): Observable<string> {
    return new Observable((observer) => {
      observer.next('Fake Data');
      observer.complete();
    });
  }
}

export interface Repository {
  fetchHelloWorld(): Observable<string>;
  fetchJohnDoe(): Observable<string>;
}

export class Client {
  constructor(private readonly repository: Repository) {}

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

function testRepositoryImpl(): void {
  // Arrange
  const mockService = new MockService();
  const repository = new RepositoryImpl(mockService);

  // Act and assert
  repository.fetchHelloWorld().subscribe((data) => console.log(data == 'Fake Data'));
}

testRepositoryImpl();

// Test unitaire
