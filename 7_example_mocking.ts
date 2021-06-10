/// Dependency Graph
///
/// Service --> Repository --> Client
///
/// Manual Instanciation when needed

import { Observable, of, Subscription } from 'rxjs';

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

/// Testing files ///
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

function test_RepositoryImpl_fetchHelloWorld(): void {
  // Arrange
  const mockService = new MockService();
  const repository = new RepositoryImpl(mockService);

  // Act and assert
  repository.fetchHelloWorld().subscribe((data) => console.log(data == 'Fake Data'));
}

function test_RepositoryImpl_fetchJohnDoe(): void {
  // Arrange
  const mockService: Service = {
    serveHelloWorld: () => of('Not used'),
    serveJohnDoe: () => of('Fake super data'),
  };
  const repository = new RepositoryImpl(mockService);

  // Act and assert
  repository.fetchHelloWorld().subscribe((data) => console.log(data == 'Fake super data'));
}

function test_Client_showHelloWorld(): void {
  // Arrange
  const mockRepository = new MockRepository();
  const client = new Client(mockRepository);

  // Act and assert
  client.showHelloWorld();

  console.log(true);
}

function test_Client_showJohnDoe(): void {
  // Arrange
  const mockRepository: Repository = {
    fetchHelloWorld: () => of('Not used'),
    fetchJohnDoe: () => of('Fake john doe'),
  };
  const client = new Client(mockRepository);

  // Act and assert
  client.showJohnDoe();

  console.log(true);
}

test_RepositoryImpl_fetchHelloWorld();
test_RepositoryImpl_fetchJohnDoe();
test_Client_showHelloWorld();
test_Client_showJohnDoe();

// Test unitaire
